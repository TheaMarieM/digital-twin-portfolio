#!/usr/bin/env python3
"""
Quick portfolio interview - No embedding service required!
Asks questions about your portfolio and saves Q&A pairs.
"""
import os
import sys
import json
import requests
from datetime import datetime

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

# Interview questions
QUESTIONS = [
    "What are your core technical skills?",
    "Tell me about your most impressive project.",
    "What programming languages and frameworks do you use?",
    "Describe your experience with web development.",
    "What's your approach to building accessible applications?",
    "Tell me about a challenging problem you solved.",
    "What tools and technologies are you proficient with?",
    "How do you ensure code quality in your projects?",
    "Describe your experience with UI/UX design.",
    "What makes you stand out as a developer?"
]

def main():
    # Load portfolio
    with open('data/profile.json', 'r', encoding='utf-8') as f:
        profile = json.load(f)
    
    # Build context from portfolio
    context_parts = []
    for item in profile.get('star_items', [])[:8]:
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
    
    # Setup
    ollama_url = os.getenv('OLLAMA_URL', 'http://127.0.0.1:11434')
    ollama_model = os.getenv('OLLAMA_MODEL', 'llama3')
    output_file = 'data/interview_qa.jsonl'
    
    os.makedirs('data', exist_ok=True)
    
    print(f"🎤 Portfolio Interview Training")
    print(f"📝 Output: {output_file}")
    print(f"🤖 Model: {ollama_model}")
    print(f"📚 Running {len(QUESTIONS)} questions...\n")
    
    qa_pairs = []
    
    for i, question in enumerate(QUESTIONS, 1):
        print(f"\n{'='*70}")
        print(f"Question {i}/{len(QUESTIONS)}: {question}")
        print('='*70)
        
        # Build prompt
        prompt = f"""You are an AI assistant answering interview questions about a professional's portfolio and experience.

Here is the portfolio information:

{portfolio_context}

Based on the portfolio information above, please answer this interview question:

Question: {question}

Answer (be specific and reference actual projects and accomplishments from the portfolio):"""
        
        try:
            print("\n🤖 Response:")
            response = call_ollama(ollama_url, ollama_model, prompt)
            print(response)
            
            # Save Q&A
            qa_pairs.append({
                'timestamp': datetime.now().isoformat(),
                'question': question,
                'response': response
            })
            
        except Exception as e:
            print(f"❌ Error: {e}")
            continue
    
    # Save all Q&A pairs
    if qa_pairs:
        with open(output_file, 'a', encoding='utf-8') as f:
            for qa in qa_pairs:
                f.write(json.dumps(qa) + '\n')
        
        print(f"\n\n✅ Saved {len(qa_pairs)} Q&A pairs to {output_file}")
    else:
        print("\n\nNo Q&A pairs to save.")

if __name__ == '__main__':
    main()
