#!/usr/bin/env python3
"""
scripts/train_interview.py

Interactive interview trainer that asks portfolio questions, gets Ollama responses,
and saves Q&A pairs to help train/improve your AI's responses about your portfolio.

Usage:
  python scripts/train_interview.py --session interview-001
  python scripts/train_interview.py --auto  # Run predefined questions automatically
"""

import os
import sys
import json
import argparse
import time
from typing import List, Dict, Any
from datetime import datetime

import requests


def upstash_command(rest_url: str, token: str, command: List[Any]):
    """Execute Upstash Redis command via REST."""
    url = rest_url.rstrip('/')
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    r = requests.post(url, json=command, headers=headers, timeout=20)
    if r.status_code >= 400:
        raise RuntimeError(f'Upstash command error {r.status_code}: {r.text}')
    data = r.json()
    return data.get('result')


def call_ollama(ollama_url: str, model: str, prompt: str) -> str:
    """Call Ollama and parse the streaming newline-delimited JSON response."""
    url = ollama_url.rstrip('/') + '/api/generate'
    payload = {'model': model, 'prompt': prompt, 'stream': True}
    r = requests.post(url, json=payload, headers={'Content-Type': 'application/json'}, timeout=120, stream=True)
    if not r.ok:
        raise RuntimeError(f'Ollama API error {r.status_code}: {r.text}')
    
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


def query_vector_context(rest_url: str, token: str, query_vector: List[float], top_k: int = 3) -> List[Dict]:
    """Query Upstash Vector for relevant context."""
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


def embed_query_local(text: str, embed_service_url: str = 'http://127.0.0.1:8001') -> List[float]:
    """Get embedding from local embedding service."""
    try:
        r = requests.post(f'{embed_service_url}/embed', json={'text': text}, timeout=15)
        if r.ok:
            return r.json().get('embedding', [])
    except Exception:
        pass
    return []


def build_rag_prompt(question: str, context_hits: List[Dict]) -> str:
    """Build prompt with retrieved context."""
    context_parts = []
    for hit in context_hits[:3]:
        meta = hit.get('metadata', {})
        title = meta.get('title', '')
        content = meta.get('content', '')
        if content:
            context_parts.append(f"[{title}]\n{content}")
    
    context_text = "\n\n".join(context_parts) if context_parts else "No specific context found."
    
    prompt = f"""You are an AI assistant helping to answer questions about a professional portfolio.

Context from portfolio:
{context_text}

Question: {question}

Please provide a clear, specific answer based on the context above. If the context doesn't fully answer the question, provide what you can and indicate what information is missing."""
    
    return prompt


# Predefined interview questions about your portfolio
INTERVIEW_QUESTIONS = [
    "What are your core technical skills?",
    "Tell me about your most challenging project.",
    "What programming languages do you specialize in?",
    "Describe your experience with cloud technologies.",
    "What frameworks and tools are you proficient with?",
    "Tell me about a time you solved a difficult technical problem.",
    "What's your experience with databases?",
    "How do you approach software architecture?",
    "What's your testing and quality assurance process?",
    "Describe your experience with DevOps and CI/CD.",
    "What projects are you most proud of?",
    "How do you stay current with technology trends?",
    "Tell me about your team collaboration experience.",
    "What's your approach to code reviews?",
    "Describe your experience with agile methodologies.",
    "What are your career goals?",
    "How do you handle technical debt?",
    "What's your experience with API design?",
    "Tell me about your frontend development experience.",
    "What's your approach to performance optimization?"
]


def main():
    parser = argparse.ArgumentParser(description='Interactive interview trainer for portfolio AI')
    parser.add_argument('--session', '-s', default=f'interview-{datetime.now().strftime("%Y%m%d-%H%M")}',
                        help='Session ID for saving conversation')
    parser.add_argument('--auto', action='store_true', help='Run predefined questions automatically')
    parser.add_argument('--output', '-o', default='data/interview_qa.jsonl',
                        help='Output file for Q&A pairs (JSONL format)')
    parser.add_argument('--use-rag', action='store_true', help='Use RAG (vector context) for responses')
    args = parser.parse_args()

    # Environment setup
    redis_url = os.getenv('UPSTASH_REDIS_REST_URL')
    redis_token = os.getenv('UPSTASH_REDIS_REST_TOKEN')
    vector_url = os.getenv('UPSTASH_VECTOR_REST_URL')
    vector_token = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
    ollama_url = os.getenv('OLLAMA_URL', 'http://127.0.0.1:11434')
    ollama_model = os.getenv('OLLAMA_MODEL', 'llama3')
    embed_service = os.getenv('LOCAL_EMBEDDING_SERVICE_URL', 'http://127.0.0.1:8001')

    if not ollama_url:
        print('Error: OLLAMA_URL not set')
        sys.exit(1)

    print(f"🎤 Interview Training Session: {args.session}")
    print(f"📝 Output: {args.output}")
    print(f"🤖 Model: {ollama_model}")
    print(f"🔍 RAG: {'Enabled' if args.use_rag else 'Disabled'}")
    print()

    # Prepare output file
    os.makedirs(os.path.dirname(args.output) or '.', exist_ok=True)

    qa_pairs = []
    session_key = f'session:{args.session}'

    if args.auto:
        # Automatic mode: run through predefined questions
        questions = INTERVIEW_QUESTIONS
        print(f"Running {len(questions)} predefined questions...\n")
    else:
        # Interactive mode
        questions = []
        print("Interactive interview mode. Type 'quit' or 'exit' to finish.\n")

    question_num = 0
    
    try:
        if args.auto:
            for question in questions:
                question_num += 1
                print(f"\n{'='*70}")
                print(f"Question {question_num}/{len(questions)}: {question}")
                print('='*70)
                
                # Build prompt (with or without RAG)
                if args.use_rag and vector_url and vector_token:
                    # Get embedding for question
                    query_embedding = embed_query_local(question, embed_service)
                    if query_embedding:
                        context_hits = query_vector_context(vector_url, vector_token, query_embedding, top_k=3)
                        prompt = build_rag_prompt(question, context_hits)
                        print(f"📚 Retrieved {len(context_hits)} context chunks")
                    else:
                        prompt = question
                        print("⚠️  Could not get embedding, using direct question")
                else:
                    prompt = question
                
                # Call Ollama
                print("\n🤖 Response:")
                try:
                    response = call_ollama(ollama_url, ollama_model, prompt)
                    print(response)
                    
                    # Save Q&A pair
                    qa_pairs.append({
                        'timestamp': datetime.now().isoformat(),
                        'session': args.session,
                        'question': question,
                        'response': response,
                        'used_rag': args.use_rag
                    })
                    
                    # Save to Redis history
                    if redis_url and redis_token:
                        try:
                            upstash_command(redis_url, redis_token, 
                                          ['LPUSH', session_key, json.dumps({'role': 'user', 'content': question})])
                            upstash_command(redis_url, redis_token,
                                          ['LPUSH', session_key, json.dumps({'role': 'assistant', 'content': response})])
                            upstash_command(redis_url, redis_token, ['EXPIRE', session_key, '86400'])
                        except Exception as e:
                            print(f"⚠️  Warning: Could not save to Redis: {e}")
                    
                except Exception as e:
                    print(f"❌ Error: {e}")
                    continue
                
                time.sleep(0.5)  # Brief pause between questions
        else:
            # Interactive mode
            while True:
                try:
                    question = input("\n❓ Your question (or 'quit' to exit): ").strip()
                    if not question or question.lower() in ('quit', 'exit', 'q'):
                        break
                    
                    question_num += 1
                    
                    # Build prompt (with or without RAG)
                    if args.use_rag and vector_url and vector_token:
                        query_embedding = embed_query_local(question, embed_service)
                        if query_embedding:
                            context_hits = query_vector_context(vector_url, vector_token, query_embedding, top_k=3)
                            prompt = build_rag_prompt(question, context_hits)
                            print(f"📚 Retrieved {len(context_hits)} context chunks")
                        else:
                            prompt = question
                            print("⚠️  Could not get embedding, using direct question")
                    else:
                        prompt = question
                    
                    # Call Ollama
                    print("\n🤖 Response:")
                    response = call_ollama(ollama_url, ollama_model, prompt)
                    print(response)
                    
                    # Save Q&A pair
                    qa_pairs.append({
                        'timestamp': datetime.now().isoformat(),
                        'session': args.session,
                        'question': question,
                        'response': response,
                        'used_rag': args.use_rag
                    })
                    
                    # Save to Redis history
                    if redis_url and redis_token:
                        try:
                            upstash_command(redis_url, redis_token,
                                          ['LPUSH', session_key, json.dumps({'role': 'user', 'content': question})])
                            upstash_command(redis_url, redis_token,
                                          ['LPUSH', session_key, json.dumps({'role': 'assistant', 'content': response})])
                            upstash_command(redis_url, redis_token, ['EXPIRE', session_key, '86400'])
                        except Exception as e:
                            print(f"⚠️  Warning: Could not save to Redis: {e}")
                    
                except KeyboardInterrupt:
                    print("\n\nInterrupted by user")
                    break
                except Exception as e:
                    print(f"❌ Error: {e}")
                    continue
    
    finally:
        # Save all Q&A pairs to file
        if qa_pairs:
            with open(args.output, 'a', encoding='utf-8') as f:
                for qa in qa_pairs:
                    f.write(json.dumps(qa) + '\n')
            
            print(f"\n\n✅ Saved {len(qa_pairs)} Q&A pairs to {args.output}")
            print(f"📊 Session: {args.session}")
            print(f"💾 Redis history key: {session_key}")
        else:
            print("\n\nNo Q&A pairs to save.")


if __name__ == '__main__':
    main()
