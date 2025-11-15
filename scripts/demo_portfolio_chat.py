#!/usr/bin/env python3
"""
Simple demo: Chat with your portfolio context (no embedding service needed for demo)
"""
import os
import sys
import json
import requests

def call_ollama(url, model, prompt):
    """Call Ollama streaming API."""
    r = requests.post(
        f'{url}/api/generate',
        json={'model': model, 'prompt': prompt, 'stream': True},
        timeout=120,
        stream=True
    )
    if not r.ok:
        raise RuntimeError(f'Ollama error {r.status_code}: {r.text}')
    
    response = []
    for line in r.iter_lines(decode_unicode=True):
        if line:
            try:
                chunk = json.loads(line)
                if 'response' in chunk:
                    response.append(chunk['response'])
                if chunk.get('done'):
                    break
            except:
                pass
    return ''.join(response).strip()

def main():
    # Load portfolio data
    with open('data/profile.json', 'r', encoding='utf-8') as f:
        profile = json.load(f)
    
    # Extract key information
    context_parts = []
    for item in profile.get('star_items', [])[:5]:  # Top 5 items
        title = item.get('title', '')
        situation = item.get('situation', '')
        task = item.get('task', '')
        action = item.get('action', '')
        result = item.get('result', '')
        
        context = f"**{title}**\n"
        if situation:
            context += f"Situation: {situation}\n"
        if task:
            context += f"Task: {task}\n"
        if action:
            context += f"Action: {action}\n"
        if result:
            context += f"Result: {result}\n"
        
        context_parts.append(context)
    
    portfolio_context = "\n\n".join(context_parts)
    
    # Get question from command line
    if len(sys.argv) < 2:
        print("Usage: python scripts/demo_portfolio_chat.py \"Your question here\"")
        sys.exit(1)
    
    question = sys.argv[1]
    
    # Build prompt with portfolio context
    prompt = f"""You are an AI assistant answering questions about a professional's portfolio and experience.

Here is the portfolio information:

{portfolio_context}

Based on the portfolio information above, please answer this question:

Question: {question}

Answer (be specific and reference the actual projects and accomplishments from the portfolio):"""
    
    # Call Ollama
    ollama_url = os.getenv('OLLAMA_URL', 'http://127.0.0.1:11434')
    ollama_model = os.getenv('OLLAMA_MODEL', 'llama3')
    
    print(f"🤖 Asking Ollama about your portfolio...\n")
    response = call_ollama(ollama_url, ollama_model, prompt)
    print(response)

if __name__ == '__main__':
    main()
