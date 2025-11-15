#!/usr/bin/env python3
"""
scripts/chat_backend.py

FastAPI backend for chat that:
 - loads session history from Upstash Redis (REST /commands)
 - embeds the user's query (local embed server or OpenAI)
 - queries Upstash Vector for top-k matches
 - builds a prompt including context and asks Ollama
 - persists updated history back to Upstash Redis
 - returns JSON { reply, matches }

Run:
  python -m pip install fastapi uvicorn requests
  uvicorn scripts.chat_backend:app --reload --port 5000

Env vars:
  UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_INDEX,
  USE_LOCAL_EMBEDDINGS (true/false), LOCAL_EMBEDDING_URL,
  OPENAI_API_KEY (optional fallback),
  OLLAMA_URL, OLLAMA_MODEL
"""

from typing import List, Any, Optional
import os
import json
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Chat Backend")

# Environment
UPSTASH_REDIS_REST_URL = os.getenv('UPSTASH_REDIS_REST_URL')
UPSTASH_REDIS_REST_TOKEN = os.getenv('UPSTASH_REDIS_REST_TOKEN')
UPSTASH_VECTOR_REST_URL = os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_VECTOR_REST_TOKEN = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
UPSTASH_VECTOR_INDEX = os.getenv('UPSTASH_VECTOR_INDEX')

USE_LOCAL = str(os.getenv('USE_LOCAL_EMBEDDINGS', '')).lower() == 'true'
LOCAL_EMBEDDING_URL = os.getenv('LOCAL_EMBEDDING_URL', 'http://127.0.0.1:8000')
EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'text-embedding-3-small')

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://127.0.0.1:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama2')

MAX_HISTORY = int(os.getenv('MAX_HISTORY_MESSAGES', '20'))
SESSION_TTL = int(os.getenv('SESSION_TTL_SECONDS', '86400'))


class ChatRequest(BaseModel):
    sessionId: Optional[str] = 'anonymous'
    message: str
    top_k: Optional[int] = 3


def upstash_redis_command(command: List[Any]):
    if not UPSTASH_REDIS_REST_URL or not UPSTASH_REDIS_REST_TOKEN:
        raise RuntimeError('Missing Upstash Redis REST URL/token')
    url = UPSTASH_REDIS_REST_URL.rstrip('/') + '/commands'
    headers = {'Authorization': f'Bearer {UPSTASH_REDIS_REST_TOKEN}', 'Content-Type': 'application/json'}
    r = requests.post(url, json={'command': command}, headers=headers, timeout=20)
    if r.status_code >= 400:
        raise RuntimeError(f'Upstash Redis command failed: {r.status_code} {r.text}')
    return r.json().get('result')


def redis_lrange(key: str, start: int, stop: int):
    return upstash_redis_command(['LRANGE', key, str(start), str(stop)])


def redis_lpush(key: str, *values: Any):
    return upstash_redis_command(['LPUSH', key, *[json.dumps(v) if not isinstance(v, str) else v for v in values]])


def redis_ltrim(key: str, start: int, stop: int):
    return upstash_redis_command(['LTRIM', key, str(start), str(stop)])


def redis_expire(key: str, seconds: int):
    return upstash_redis_command(['EXPIRE', key, str(seconds)])


def embed_text_local(text: str):
    url = LOCAL_EMBEDDING_URL.rstrip('/') + '/embed'
    r = requests.post(url, json={'input': text}, timeout=30)
    if not r.ok:
        raise RuntimeError(f'Local embed error {r.status_code}: {r.text}')
    j = r.json()
    if 'embedding' in j:
        return j['embedding']
    if 'embeddings' in j:
        return j['embeddings'][0]
    raise RuntimeError('Local embed returned unexpected shape')


def embed_text_openai(text: str):
    if not OPENAI_API_KEY:
        raise RuntimeError('OPENAI_API_KEY missing')
    url = 'https://api.openai.com/v1/embeddings'
    headers = {'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'}
    body = {'model': EMBEDDING_MODEL, 'input': text}
    r = requests.post(url, json=body, headers=headers, timeout=30)
    if not r.ok:
        raise RuntimeError(f'OpenAI embed error {r.status_code}: {r.text}')
    j = r.json()
    return j['data'][0]['embedding']


def query_upstash_vector(vector: List[float], top_k: int):
    if not UPSTASH_VECTOR_REST_URL or not UPSTASH_VECTOR_REST_TOKEN or not UPSTASH_VECTOR_INDEX:
        raise RuntimeError('Missing Upstash Vector configuration env vars')
    url = UPSTASH_VECTOR_REST_URL.rstrip('/') + f'/v1/index/{UPSTASH_VECTOR_INDEX}/query'
    headers = {'Authorization': f'Bearer {UPSTASH_VECTOR_REST_TOKEN}', 'Content-Type': 'application/json'}
    payload = {'vector': vector, 'top_k': top_k, 'include_metadata': True}
    r = requests.post(url, json=payload, headers=headers, timeout=30)
    if not r.ok:
        raise RuntimeError(f'Upstash Vector query error {r.status_code}: {r.text}')
    return r.json()


def build_prompt_from_context(context_texts: List[str], question: str) -> str:
    ctx = '\n'.join([f"- {c}" for c in context_texts if c])
    prompt = f"Use the following context to answer the question. If the answer isn't in the context, say you don't know.\n\nContext:\n{ctx}\n\nUser: {question}\nAssistant:"
    return prompt


def call_ollama(prompt: str, max_tokens: int = 800, temperature: float = 0.2):
    url = OLLAMA_URL.rstrip('/') + '/api/generate'
    payload = {'model': OLLAMA_MODEL, 'prompt': prompt, 'max_tokens': max_tokens, 'temperature': temperature}
    r = requests.post(url, json=payload, headers={'Content-Type': 'application/json'}, timeout=60)
    if not r.ok:
        raise RuntimeError(f'Ollama error {r.status_code}: {r.text}')
    try:
        j = r.json()
    except Exception:
        return r.text
    # Accept several shapes
    if isinstance(j, dict):
        for k in ('text', 'output', 'result'):
            if k in j and isinstance(j[k], str):
                return j[k].strip()
        if 'choices' in j and isinstance(j['choices'], list) and j['choices']:
            c0 = j['choices'][0]
            if isinstance(c0, dict) and 'text' in c0:
                return str(c0['text']).strip()
    return str(j)


@app.post('/chat')
def chat(req: ChatRequest):
    if not req.message or not isinstance(req.message, str):
        raise HTTPException(status_code=400, detail='missing message')

    sid = req.sessionId or 'anonymous'
    key = f'chatHistory:{sid}'

    # 1) Load history from Upstash Redis (newest-first) and reverse to chronological
    try:
        raw = redis_lrange = redis_lrange  # type: ignore
        raw = redis_lrange(key, 0, MAX_HISTORY - 1) if UPSTASH_REDIS_REST_URL else []
    except Exception as e:
        raw = []
        print('Warning: failed to load history', e)

    history = []
    try:
        for s in list(raw)[::-1]:
            try:
                history.append(json.loads(s))
            except Exception:
                history.append({'role': 'user', 'content': str(s)})
    except Exception:
        history = []

    messages_for_model = history + [{'role': 'user', 'content': req.message}]

    # 2) Embed the query
    try:
        if USE_LOCAL:
            q_emb = embed_text_local(req.message)
        else:
            q_emb = embed_text_openai(req.message)
    except Exception as e:
        print('Embed error, continuing without semantic context:', e)
        q_emb = None

    # 3) Query Upstash Vector if we have an embedding
    context_texts = []
    matches = []
    if q_emb is not None:
        try:
            qres = query_upstash_vector(q_emb, req.top_k or 3)
            # Upstash returns a variety of shapes; try to extract 'results' or 'matches'
            entries = qres.get('results') or qres.get('matches') or qres.get('data') or []
            # entries may be list of {id, score, metadata}
            for e in entries:
                md = e.get('metadata') if isinstance(e, dict) else None
                if not md:
                    # maybe nested
                    md = e
                text = md.get('content') or md.get('text') or md.get('metadata') or md.get('source') or md.get('desc') if isinstance(md, dict) else None
                if not text:
                    # try stringifying metadata
                    try:
                        text = json.dumps(md)
                    except Exception:
                        text = None
                if text:
                    context_texts.append(text)
                matches.append(md or e)
        except Exception as e:
            print('Vector query error, continuing without context:', e)

    # 4) Build prompt and call Ollama
    prompt = build_prompt_from_context(context_texts, req.message)
    try:
        reply = call_ollama(prompt)
    except Exception as e:
        # fallback to OpenAI chat if available
        if OPENAI_API_KEY:
            try:
                headers = {'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'}
                body = {'model': os.getenv('OPENAI_CHAT_MODEL','gpt-4o-mini'), 'messages': messages_for_model, 'max_tokens': 800}
                r = requests.post('https://api.openai.com/v1/chat/completions', json=body, headers=headers, timeout=30)
                r.raise_for_status()
                od = r.json()
                reply = od['choices'][0]['message']['content']
            except Exception as oe:
                raise HTTPException(status_code=502, detail=f'LLM error: Ollama failed: {e}; OpenAI fallback failed: {oe}')
        else:
            raise HTTPException(status_code=502, detail=f'LLM error: Ollama failed: {e}')

    # 5) Persist history back to Upstash Redis
    try:
        redis_lpush(key, {'role': 'user', 'content': req.message})
        redis_lpush(key, {'role': 'assistant', 'content': reply})
        redis_ltrim(key, 0, MAX_HISTORY - 1)
        redis_expire(key, SESSION_TTL)
    except Exception as e:
        print('Warning: failed to persist history', e)

    return {'reply': reply, 'matches': matches}
