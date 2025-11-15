"""
Interview simulation and question tools for MCP server
"""
import os
import json
from typing import Optional

# Common interview questions by category
INTERVIEW_QUESTIONS = {
    "technical": [
        "What are your core technical skills?",
        "What programming languages and frameworks do you use?",
        "Describe your experience with web development.",
        "How do you ensure code quality in your projects?",
        "What tools and technologies are you proficient with?"
    ],
    "behavioral": [
        "Tell me about a challenging problem you solved.",
        "Describe a time when you had to learn something new quickly.",
        "How do you handle project deadlines and priorities?",
        "Tell me about a time you improved a process or system."
    ],
    "projects": [
        "Tell me about your most impressive project.",
        "What makes you stand out as a developer?",
        "Describe a project where you made a significant impact.",
        "What's the most technically challenging thing you've built?"
    ],
    "accessibility": [
        "What's your approach to building accessible applications?",
        "Describe your experience with WCAG compliance.",
        "How do you test for accessibility in your projects?"
    ],
    "design": [
        "Describe your experience with UI/UX design.",
        "How do you approach responsive design?",
        "What's your process for creating user-friendly interfaces?"
    ]
}

async def ask_interview_question(question: str, portfolio_data: dict) -> dict:
    """
    Answer an interview question using portfolio data
    Returns structured answer with specific examples
    """
    # Build context from portfolio
    context_parts = []
    for item in portfolio_data.get("star_items", [])[:8]:
        context = f"**{item.get('title', '')}**\n"
        if item.get('situation'):
            context += f"Situation: {item.get('situation')}\n"
        if item.get('task'):
            context += f"Task: {item.get('task')}\n"
        if item.get('action'):
            context += f"Action: {item.get('action')}\n"
        if item.get('result'):
            context += f"Result: {item.get('result')}\n"
        context_parts.append(context)
    
    portfolio_context = "\n\n".join(context_parts)
    
    # Find relevant examples
    relevant_examples = []
    question_lower = question.lower()
    
    for item in portfolio_data.get("star_items", []):
        text = " ".join([
            item.get("title", ""),
            item.get("action", ""),
            item.get("result", "")
        ]).lower()
        
        # Simple relevance matching
        if any(word in text for word in question_lower.split() if len(word) > 4):
            relevant_examples.append({
                "title": item.get("title", ""),
                "situation": item.get("situation", ""),
                "task": item.get("task", ""),
                "action": item.get("action", ""),
                "result": item.get("result", "")
            })
    
    return {
        "question": question,
        "portfolio_context": portfolio_context,
        "relevant_examples": relevant_examples[:3],  # Top 3 most relevant
        "suggestion": "Use the STAR method to structure your answer: Situation, Task, Action, Result",
        "note": "For AI-generated answer, use this context with an LLM like Ollama"
    }

async def get_interview_questions(category: Optional[str] = None) -> dict:
    """
    Get list of common interview questions
    """
    if category and category.lower() in INTERVIEW_QUESTIONS:
        return {
            "category": category,
            "questions": INTERVIEW_QUESTIONS[category.lower()]
        }
    
    # Return all categories
    all_questions = []
    for cat, questions in INTERVIEW_QUESTIONS.items():
        all_questions.extend([{
            "category": cat,
            "question": q
        } for q in questions])
    
    return {
        "total_questions": len(all_questions),
        "categories": list(INTERVIEW_QUESTIONS.keys()),
        "questions": all_questions
    }

async def get_prepared_answers(portfolio_data: dict) -> dict:
    """
    Get pre-generated answers from interview training data
    """
    try:
        qa_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "interview_qa.jsonl")
        answers = []
        
        if os.path.exists(qa_file):
            with open(qa_file, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        qa_pair = json.loads(line)
                        answers.append({
                            "question": qa_pair.get("question", ""),
                            "answer": qa_pair.get("response", ""),
                            "timestamp": qa_pair.get("timestamp", "")
                        })
        
        return {
            "total_answers": len(answers),
            "prepared_answers": answers
        }
    except Exception as e:
        return {
            "error": f"Could not load prepared answers: {str(e)}",
            "prepared_answers": []
        }
