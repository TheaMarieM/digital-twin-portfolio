#!/usr/bin/env python3
"""
scripts/chat_with_ollama.py

RAG-enabled chat with Ollama that retrieves relevant context from your portfolio.

Load conversation history from Upstash Redis (REST), retrieve relevant portfolio context
from Upstash Vector, send the assembled prompt with context to Ollama, save the updated 
history back to Redis, and print the assistant reply.

Environment variables required:
  UPSTASH_REDIS_REST_URL  - e.g. https://xxxx-upstash-redis.upstash.io
  UPSTASH_REDIS_REST_TOKEN
  UPSTASH_VECTOR_REST_URL - e.g. https://xxxx-upstash-vector.upstash.io
  UPSTASH_VECTOR_REST_TOKEN
  OLLAMA_URL              - e.g. http://127.0.0.1:11434 (default)
  OLLAMA_MODEL            - model name to use (default: llama3)
  USE_LOCAL_EMBEDDINGS    - "true" to use local embedding service (default: false)
  LOCAL_EMBEDDING_SERVICE_URL - e.g. http://127.0.0.1:8001 (default)
  MAX_HISTORY_MESSAGES    - number of messages to keep (default: 20)
  SESSION_TTL_SECONDS     - TTL for conversation keys (default: 86400)

Usage:
  python scripts/chat_with_ollama.py --session mysession --message "What are your skills?"
  # or interactively
  python scripts/chat_with_ollama.py --session mysession

This script uses RAG to retrieve portfolio context before generating responses.
"""

import os
import sys
import json
import argparse
import time
from typing import List, Any

import requests


def upstash_command(rest_url: str, token: str, command: List[Any]):
    # Upstash Redis REST API expects commands as a direct JSON array, not wrapped in {"command": [...]}
    url = rest_url.rstrip('/')
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    # Send command as direct JSON array
    r = requests.post(url, json=command, headers=headers, timeout=20)
    if r.status_code >= 400:
        raise RuntimeError(f'Upstash command error {r.status_code}: {r.text}')
    data = r.json()
    # Upstash returns {"result": ...} for commands
    return data.get('result')


def lrange(rest_url: str, token: str, key: str, start: int, stop: int):
    return upstash_command(rest_url, token, ['LRANGE', key, str(start), str(stop)])


def lpush(rest_url: str, token: str, key: str, *values: str):
    return upstash_command(rest_url, token, ['LPUSH', key, *values])


def ltrim(rest_url: str, token: str, key: str, start: int, stop: int):
    return upstash_command(rest_url, token, ['LTRIM', key, str(start), str(stop)])


def expire(rest_url: str, token: str, key: str, seconds: int):
    return upstash_command(rest_url, token, ['EXPIRE', key, str(seconds)])


def embed_text_local(text: str, service_url: str = 'http://127.0.0.1:8001') -> List[float]:
    """Get embedding from local embedding service."""
    try:
        r = requests.post(f'{service_url}/embed', json={'text': text}, timeout=15)
        if r.ok:
            return r.json().get('embedding', [])
    except Exception as e:
        print(f"Warning: Could not get local embedding: {e}")
    return []


def query_vector_context(rest_url: str, token: str, query_vector: List[float], top_k: int = 3):
    """Query Upstash Vector for relevant portfolio context."""
    url = rest_url.rstrip('/') + '/query'
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    payload = {
        'vector': query_vector,
        'topK': top_k,
        'includeMetadata': True
    }
    r = requests.post(url, json=payload, headers=headers, timeout=30)
    if r.status_code >= 400:
        raise RuntimeError(f'Vector query error {r.status_code}: {r.text}')
    data = r.json()
    return data.get('result', [])


def build_rag_prompt(question: str, context_hits: list, history: List[dict] = None) -> str:
    """Build prompt with portfolio context and optional conversation history."""
    # Extract context from vector hits
    context_parts = []
    for hit in context_hits[:3]:
        meta = hit.get('metadata', {})
        title = meta.get('title', '')
        content = meta.get('content', '')
        if content:
            context_parts.append(f"[{title}]\n{content}")
    
    context_text = "\n\n".join(context_parts) if context_parts else ""
    
    # Build system prompt with portfolio context
    system_prompt = f"""You are an AI assistant answering questions about a professional's portfolio and experience.

Portfolio Context:
{context_text}

Instructions:
- Answer questions based on the portfolio context provided above
- Be specific and reference actual projects, skills, and accomplishments from the context
- If the context doesn't contain relevant information, say so honestly
- Keep responses concise and professional
"""
    
    # Add conversation history if available
    if history:
        history_text = "\n".join([f"{m.get('role', 'user').title()}: {m.get('content', '')}" for m in history[-4:]])
        prompt = f"{system_prompt}\n\nConversation History:\n{history_text}\n\nUser: {question}\nAssistant:"
    else:
        prompt = f"{system_prompt}\n\nUser: {question}\nAssistant:"
    
    return prompt


def build_prompt_from_history(history: List[dict]) -> str:
    # history: list of {role, content} in chronological order
    parts = []
    for m in history:
        role = 'Assistant' if m.get('role') == 'assistant' else 'User'
        parts.append(f"{role}: {m.get('content','')}")
    parts.append('Assistant:')
    return '\n'.join(parts)


def call_ollama(ollama_url: str, model: str, prompt: str, max_tokens: int = 800, temperature: float = 0.2) -> str:
    """Call Ollama and parse the streaming newline-delimited JSON response."""
    url = ollama_url.rstrip('/') + '/api/generate'
    payload = {'model': model, 'prompt': prompt, 'stream': True}
    r = requests.post(url, json=payload, headers={'Content-Type': 'application/json'}, timeout=60, stream=True)
    if not r.ok:
        raise RuntimeError(f'Ollama API error {r.status_code}: {r.text}')
    
    # Ollama /api/generate returns newline-delimited JSON: each line is {"response": "token", "done": false}
    response_text = []
    for line in r.iter_lines(decode_unicode=True):
        if not line:
            continue
        try:
            chunk = json.loads(line)
            if 'response' in chunk:
                response_text.append(chunk['response'])
            if chunk.get('done'):
                break
        except json.JSONDecodeError:
            continue
    
    return ''.join(response_text).strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--session', '-s', default='anonymous', help='session id (chatHistory:{session})')
    parser.add_argument('--message', '-m', help='message to send. If omitted the script will prompt interactively')
    args = parser.parse_args()

    rest_url = os.getenv('UPSTASH_REDIS_REST_URL')
    token = os.getenv('UPSTASH_REDIS_REST_TOKEN')
    if not rest_url or not token:
        print('Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables')
        sys.exit(2)

    # Vector DB config
    vector_url = os.getenv('UPSTASH_VECTOR_REST_URL')
    vector_token = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
    use_local_embeddings = os.getenv('USE_LOCAL_EMBEDDINGS', 'false').lower() == 'true'
    embed_service_url = os.getenv('LOCAL_EMBEDDING_SERVICE_URL', 'http://127.0.0.1:8001')
    
    ollama_url = os.getenv('OLLAMA_URL', 'http://127.0.0.1:11434')
    ollama_model = os.getenv('OLLAMA_MODEL', 'llama3')
    max_history = int(os.getenv('MAX_HISTORY_MESSAGES', '20'))
    ttl = int(os.getenv('SESSION_TTL_SECONDS', '86400'))

    message = args.message
    if not message:
        try:
            message = input('You: ')
        except KeyboardInterrupt:
            print('\nAborted')
            sys.exit(0)

    key = f'chatHistory:{args.session}'

    # Load recent history (Upstash stores newest-first). We request 0..max_history-1
    raw = lrange(rest_url, token, key, 0, max_history - 1) or []
    # raw is newest-first; reverse to chronological
    history = []
    for s in list(raw)[::-1]:
        try:
            history.append(json.loads(s))
        except Exception:
            # if stored as plain string, treat as user content
            history.append({'role': 'user', 'content': str(s)})

    # RAG: Retrieve relevant portfolio context
    context_hits = []
    if vector_url and vector_token and use_local_embeddings:
        try:
            print("🔍 Searching portfolio context...")
            query_embedding = embed_text_local(message, embed_service_url)
            if query_embedding:
                context_hits = query_vector_context(vector_url, vector_token, query_embedding, top_k=3)
                print(f"✅ Found {len(context_hits)} relevant portfolio items")
            else:
                print("⚠️  Warning: Could not generate embedding for query")
        except Exception as e:
            print(f"⚠️  Warning: Vector search failed: {e}")
    
    # Build prompt with RAG context
    if context_hits:
        prompt = build_rag_prompt(message, context_hits, history)
    else:
        messages_for_model = history + [{'role': 'user', 'content': message}]
        prompt = build_prompt_from_history(messages_for_model)

    try:
        reply = call_ollama(ollama_url, ollama_model, prompt)
    except Exception as e:
        # If Ollama fails and OpenAI key is present, optionally fallback (not enabled here by default)
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            print('Ollama failed, but OPENAI_API_KEY is present — attempting OpenAI fallback')
            try:
                import openai
                openai.api_key = openai_key
                od = openai.ChatCompletion.create(model=os.getenv('OPENAI_CHAT_MODEL','gpt-4o-mini'), messages=messages_for_model, max_tokens=800, temperature=0.2)
                reply = od.choices[0].message.content
            except Exception as oe:
                raise RuntimeError(f'Ollama error: {e}; OpenAI fallback error: {oe}')
        else:
            raise

    # Persist conversation to Upstash: LPUSH user, LPUSH assistant, trim, expire
    try:
        lpush(rest_url, token, key, json.dumps({'role': 'user', 'content': message}))
        lpush(rest_url, token, key, json.dumps({'role': 'assistant', 'content': reply}))
        ltrim(rest_url, token, key, 0, max_history - 1)
        expire(rest_url, token, key, ttl)
    except Exception as e:
        print('Warning: failed to persist chat history to Upstash:', e)

    # Output assistant reply
    print('\nAssistant:', reply)


if __name__ == '__main__':
    main()
