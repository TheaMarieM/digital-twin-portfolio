#!/usr/bin/env python3
"""Embed and upsert profile data into Upstash Vector.

Usage:
  1. Install dependencies:
     python -m pip install --upgrade pip
     python -m pip install openai upstash-vector tiktoken

  2. Set env vars (example .env.local):
     OPENAI_API_KEY=sk-...
     UPSTASH_VECTOR_REST_URL=https://<your-upstash-vector-endpoint>
     UPSTASH_VECTOR_REST_TOKEN=<your-upstash-token>
     UPSTASH_VECTOR_INDEX=portfolio
     EMBEDDING_MODEL=text-embedding-3-small

  3. Run:
     python scripts/embed_and_upsert.py --input data/profile.json

This script is intentionally conservative: it chunks long texts, retries on transient
errors, and upserts in small batches. It uses the upstash-vector Python client for
upserts/queries.
"""

import os
import json
import time
import argparse
from typing import List

import openai
from upstash_vector import Index, Vector


def chunk_text(text: str, max_chars: int = 1000) -> List[str]:
    """Naive chunker by characters preserving sentence boundaries where possible."""
    text = text.strip()
    if len(text) <= max_chars:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = min(start + max_chars, len(text))
        # try to break at last period within range
        if end < len(text):
            slice_ = text[start:end]
            last_period = slice_.rfind('. ')
            if last_period != -1 and last_period > max_chars // 3:
                end = start + last_period + 1
        chunks.append(text[start:end].strip())
        start = end
    return [c for c in chunks if c]


def embed_text(text: str, model: str):
    resp = openai.Embedding.create(model=model, input=text)
    return resp["data"][0]["embedding"]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/profile.json", help="Path to profile JSON")
    parser.add_argument("--index", default=os.getenv("UPSTASH_VECTOR_INDEX"), help="Upstash index name")
    parser.add_argument("--batch", type=int, default=16, help="Vectors per upsert batch")
    args = parser.parse_args()

    openai_key = os.getenv("OPENAI_API_KEY")
    upstash_url = os.getenv("UPSTASH_VECTOR_REST_URL")
    upstash_token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
    embedding_model = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

    if not openai_key:
        raise SystemExit("Missing OPENAI_API_KEY in environment")
    if not upstash_url or not upstash_token:
        raise SystemExit("Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN in environment")
    if not args.index:
        raise SystemExit("Provide index name via --index or UPSTASH_VECTOR_INDEX env var")

    openai.api_key = openai_key

    index = Index(url=upstash_url, token=upstash_token)

    with open(args.input, "r", encoding="utf-8") as f:
        profile = json.load(f)

    items = profile.get("star_items", [])
    all_vectors = []

    for item in items:
        item_id = item.get("id") or item.get("title", "item")
        # create a single textual blob for embedding
        text_parts = [item.get(k, "") for k in ["title", "situation", "task", "action", "result"]]
        full_text = "\n".join([p for p in text_parts if p])
        chunks = chunk_text(full_text, max_chars=1000)

        for i, chunk in enumerate(chunks):
            vec_id = f"{item_id}-{i}"
            print(f"Embedding {vec_id} (len={len(chunk)})")
            # embed with retries
            for attempt in range(3):
                try:
                    embedding = embed_text(chunk, embedding_model)
                    break
                except Exception as e:
                    print(f"Embedding error (attempt {attempt+1}): {e}")
                    time.sleep(1 + attempt * 2)
            else:
                print(f"Failed to embed chunk {vec_id}, skipping")
                continue

            metadata = {
                "source_id": item_id,
                "title": item.get("title"),
                "chunk_index": i,
            }

            all_vectors.append(Vector(id=vec_id, vector=embedding, metadata=metadata))

            # flush batches
            if len(all_vectors) >= args.batch:
                print(f"Upserting batch of {len(all_vectors)} vectors...")
                index.upsert(vectors=all_vectors, index=args.index)
                all_vectors = []
                time.sleep(0.1)

    if all_vectors:
        print(f"Upserting final batch of {len(all_vectors)} vectors...")
        index.upsert(vectors=all_vectors, index=args.index)

    # Simple verification: query back with first vector (if any)
    try:
        if items:
            sample_id = f"{items[0].get('id')}-0"
            print("Querying back sample vector to verify...")
            # We don't have the original vector here; query by id -> upstash client supports fetch/query
            res = index.query(id=sample_id, index=args.index, include_vectors=False, include_metadata=True)
            print("Query result:", res)
    except Exception as e:
        print("Verification query failed:", e)


if __name__ == "__main__":
    main()
