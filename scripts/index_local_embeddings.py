#!/usr/bin/env python3
"""
scripts/index_local_embeddings.py

Create local embeddings with sentence-transformers and upsert to Upstash Vector via REST API.

Usage:
  python scripts/index_local_embeddings.py --input data/profile.json --index portfolio

Environment variables (set in .env.local or shell):
  UPSTASH_VECTOR_REST_URL - e.g. https://...-vector.upstash.io
  UPSTASH_VECTOR_REST_TOKEN - Upstash REST token
  UPSTASH_VECTOR_INDEX - index name (portfolio)
  EMBEDDING_MODEL - sentence-transformers model (default: all-MiniLM-L6-v2)
  EMBEDDING_DIM - expected dimension (default: 384 for all-MiniLM-L6-v2)

This script is conservative: it checks the model dim and warns if it doesn't match EMBEDDING_DIM.
"""

import os
import sys
import json
import time
import hashlib
import argparse
from typing import List

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    # sentence-transformers is optional if using OpenAI embeddings
    SentenceTransformer = None

import requests
import os


def sha_id(*parts) -> str:
    h = hashlib.sha1()
    for p in parts:
        h.update(str(p).encode('utf-8'))
    return h.hexdigest()


def chunk_texts(profile: dict) -> List[dict]:
    # Build STAR chunks like the app expects
    items = profile.get('star_items') or profile.get('star_items', [])
    chunks = []
    for item in items:
        base = {'id': item.get('id') or sha_id(item.get('title','')[:24]), 'title': item.get('title','')}
        for sec in ['situation','task','action','result']:
            content = item.get(sec) or item.get(sec.capitalize()) or item.get(sec.lower())
            if not content:
                continue
            chunks.append({
                'id': f"{base['id']}-{sec}",
                'title': base['title'],
                'section': sec.capitalize(),
                'content': content,
            })
    return chunks


def embed_texts(model: SentenceTransformer, texts: List[str]) -> List[List[float]]:
    embeddings = model.encode(texts, show_progress_bar=False)
    # convert to python floats
    return [list(map(float, e)) for e in embeddings]


def upsert_vectors(rest_url: str, token: str, index: str, vectors: List[dict]):
    # Upstash Vector REST API expects the vectors as a direct JSON array, not wrapped
    url = f"{rest_url.rstrip('/')}/upsert"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    # Send vectors directly as the JSON payload (array of vector objects)
    resp = requests.post(url, json=vectors, headers=headers, timeout=30)
    if resp.status_code >= 400:
        raise RuntimeError(f"Upsert failed {resp.status_code}: {resp.text}")
    return resp.json()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to profile.json")
    parser.add_argument("--index", required=True, help="Upstash vector index name (portfolio)")
    parser.add_argument("--batch", type=int, default=64, help="Upsert batch size")
    args = parser.parse_args()

    rest_url = os.environ.get('UPSTASH_VECTOR_REST_URL')
    token = os.environ.get('UPSTASH_VECTOR_REST_TOKEN')
    index = args.index or os.environ.get('UPSTASH_VECTOR_INDEX')
    # Allow using OpenAI embeddings to match an existing Upstash index (e.g. 1536 dims)
    USE_OPENAI = str(os.environ.get('USE_OPENAI_EMBEDDINGS', '')).lower() == 'true'
    model_name = os.environ.get('EMBEDDING_MODEL') or os.environ.get('LOCAL_EMBEDDING_MODEL') or ('all-MiniLM-L6-v2' if not USE_OPENAI else 'openai:text-embedding-3-small')
    expected_dim = int(os.environ.get('EMBEDDING_DIM') or (1536 if USE_OPENAI else 384))

    if not rest_url or not token or not index:
        print("Please set UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN and pass --index or set UPSTASH_VECTOR_INDEX")
        sys.exit(2)

    print("Loading profile...", args.input)
    with open(args.input, 'r', encoding='utf-8') as f:
        profile = json.load(f)

    chunks = chunk_texts(profile)
    if not chunks:
        print("No STAR chunks found in profile. Ensure 'star_items' exists in the profile JSON.")
        sys.exit(1)

    print(f"Found {len(chunks)} chunks. Loading embedding model: {model_name} (openai_mode={USE_OPENAI})")

    texts = [f"{c['title']} — {c['section']}: {c['content']}" for c in chunks]

    if USE_OPENAI:
        # Use OpenAI embeddings via the HTTP API
        import openai
        openai_api_key = os.environ.get('OPENAI_API_KEY')
        if not openai_api_key:
            print("OPENAI_API_KEY required when USE_OPENAI_EMBEDDINGS=true")
            sys.exit(2)
        openai.api_key = openai_api_key

        def embed_texts_openai(texts_batch: List[str]) -> List[List[float]]:
            # Support both old and new openai-python interfaces
            model_name = os.environ.get('EMBEDDING_MODEL', 'text-embedding-3-small')
            try:
                # older interface
                resp = openai.Embedding.create(model=model_name, input=texts_batch)
                embs = [d['embedding'] for d in resp['data']]
            except Exception:
                # new interface (openai>=1.0.0)
                try:
                    from openai import OpenAI
                    client = OpenAI()
                    resp = client.embeddings.create(model=model_name, input=texts_batch)
                    embs = [d['embedding'] for d in resp.data]
                except Exception as e:
                    raise RuntimeError(f"OpenAI embedding call failed: {e}")
            return [list(map(float, e)) for e in embs]

        # Probe a single batch to confirm dim
        sample_embs = embed_texts_openai(texts[:1])
        actual_dim = len(sample_embs[0])
        print(f"OpenAI embedding dimension: {actual_dim}")
        if actual_dim != expected_dim:
            print(f"Warning: OpenAI embedding dim {actual_dim} != EMBEDDING_DIM {expected_dim}. Update Upstash index or EMBEDDING_DIM.")

        def embed_texts(model, texts_batch: List[str]) -> List[List[float]]:
            return embed_texts_openai(texts_batch)

    else:
        if SentenceTransformer is None:
            print("Missing dependency 'sentence-transformers'. Install with: pip install sentence-transformers or enable USE_OPENAI_EMBEDDINGS=true to use OpenAI embeddings")
            sys.exit(2)

        model = SentenceTransformer(model_name)
        actual_dim = model.get_sentence_embedding_dimension()
        print(f"Model dimension: {actual_dim}")
        if actual_dim != expected_dim:
            print(f"Warning: model embedding dim {actual_dim} != EMBEDDING_DIM {expected_dim}. Update Upstash index or EMBEDDING_DIM.")

        def embed_texts(model, texts_batch: List[str]) -> List[List[float]]:
            embeddings = model.encode(texts_batch, show_progress_bar=False)
            return [list(map(float, e)) for e in embeddings]

    batch = args.batch
    total = len(texts)
    i = 0
    while i < total:
        j = min(i + batch, total)
        batch_texts = texts[i:j]
        batch_chunks = chunks[i:j]
        print(f"Embedding batch {i}-{j} (size {len(batch_texts)})...")
        embs = embed_texts(model, batch_texts)

        vectors = []
        for ch, emb in zip(batch_chunks, embs):
            vectors.append({
                "id": ch['id'],
                "vector": emb,
                "metadata": {"title": ch['title'], "section": ch['section'], "content": ch['content']},
            })

        # Retry logic for upsert
        attempts = 0
        while True:
            try:
                res = upsert_vectors(rest_url, token, index, vectors)
                print(f"Upserted batch {i}-{j}: {res}")
                break
            except Exception as e:
                attempts += 1
                print(f"Upsert error: {e}")
                if attempts > 3:
                    print("Giving up after 3 attempts")
                    raise
                backoff = 2 ** attempts
                print(f"Retrying in {backoff}s...")
                time.sleep(backoff)

        i = j

    print("All batches upserted successfully.")


if __name__ == '__main__':
    main()
