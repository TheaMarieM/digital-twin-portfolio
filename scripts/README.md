Scripts folder instructions

Prerequisites:
- Python 3.9+ and an optional virtual environment

Install dependencies (PowerShell):

    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    python -m pip install --upgrade pip
    python -m pip install -r ..\requirements.txt

Notes about sentence-transformers and torch on Windows:
- If you run into wheel or CUDA issues when installing torch, follow the official
  PyTorch instructions at https://pytorch.org/get-started/locally/ and pick the
  correct wheel for your Python and CUDA (or CPU-only) configuration.

Quick run commands (PowerShell):

Start the local embedding server:

    python .\scripts\serve_local_embeddings.py

Run the indexer (embed & upsert to Upstash Vector):

    python .\scripts\index_local_embeddings.py --input .\data\profile.json --index portfolio

Start the FastAPI backend (use python -m uvicorn to avoid PATH issues):

    python -m uvicorn scripts.chat_backend:app --reload --port 5000

Test the chat endpoint (PowerShell example):

    Invoke-RestMethod -Method POST -Uri http://127.0.0.1:5000/chat -ContentType 'application/json' -Body (ConvertTo-Json @{ sessionId='demo'; message='What projects have you built?'; top_k=3 })

CLI chat with Ollama (interactive):

    python .\scripts\chat_with_ollama.py --session mysession --message "Tell me about your skills"

Interactive interview training (automatic mode with 20 questions):

    python .\scripts\train_interview.py --auto --use-rag

Interactive interview training (manual Q&A):

    python .\scripts\train_interview.py --session custom-001

Essential environment variables:
- UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_INDEX
- UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
- USE_LOCAL_EMBEDDINGS (set to "true" to use the local embed server)
- LOCAL_EMBEDDING_URL (default http://127.0.0.1:8000)
- OLLAMA_URL, OLLAMA_MODEL
- Optional: OPENAI_API_KEY (for fallback)
