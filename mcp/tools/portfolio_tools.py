"""
Portfolio query and data access tools for MCP server
"""
import json
from typing import Any, Optional, List, Dict

async def query_portfolio(query: str, portfolio_data: dict) -> dict:
    """
    Query portfolio using natural language
    Returns relevant information based on the query
    """
    query_lower = query.lower()
    results = {
        "query": query,
        "matches": []
    }
    
    # Search through STAR items
    for item in portfolio_data.get("star_items", []):
        # Check if query matches title, situation, task, action, or result
        searchable = " ".join([
            item.get("title", ""),
            item.get("situation", ""),
            item.get("task", ""),
            item.get("action", ""),
            item.get("result", "")
        ]).lower()
        
        # Simple keyword matching
        query_words = query_lower.split()
        if any(word in searchable for word in query_words if len(word) > 3):
            results["matches"].append({
                "title": item.get("title", ""),
                "situation": item.get("situation", ""),
                "task": item.get("task", ""),
                "action": item.get("action", ""),
                "result": item.get("result", ""),
                "relevance": "high" if all(word in searchable for word in query_words if len(word) > 3) else "medium"
            })
    
    return results

async def get_projects(portfolio_data: dict, limit: Optional[int] = None) -> dict:
    """
    Get list of all projects from portfolio
    """
    star_items = portfolio_data.get("star_items", [])
    
    # Filter to projects (items with clear deliverables/results)
    projects = []
    for item in star_items:
        projects.append({
            "title": item.get("title", ""),
            "description": item.get("situation", "") + " " + item.get("task", ""),
            "actions": item.get("action", ""),
            "results": item.get("result", ""),
            "technologies": extract_technologies(item)
        })
    
    if limit:
        projects = projects[:limit]
    
    return {
        "total": len(projects),
        "projects": projects
    }

async def get_skills(portfolio_data: dict, category: Optional[str] = None) -> dict:
    """
    Extract and categorize skills from portfolio
    """
    skills = {
        "frontend": set(),
        "backend": set(),
        "tools": set(),
        "practices": set()
    }
    
    # Extract skills from all STAR items
    for item in portfolio_data.get("star_items", []):
        text = " ".join([
            item.get("action", ""),
            item.get("result", "")
        ])
        
        # Frontend technologies
        frontend_keywords = ["html", "css", "javascript", "react", "next.js", "tailwind", "responsive", "ui", "ux"]
        for kw in frontend_keywords:
            if kw.lower() in text.lower():
                skills["frontend"].add(kw)
        
        # Backend/tools
        backend_keywords = ["python", "node", "api", "database", "redis", "upstash"]
        for kw in backend_keywords:
            if kw.lower() in text.lower():
                skills["backend"].add(kw)
        
        # Tools
        tool_keywords = ["git", "vscode", "figma", "vercel"]
        for kw in tool_keywords:
            if kw.lower() in text.lower():
                skills["tools"].add(kw)
        
        # Practices
        practice_keywords = ["accessibility", "wcag", "testing", "optimization", "performance"]
        for kw in practice_keywords:
            if kw.lower() in text.lower():
                skills["practices"].add(kw)
    
    # Convert sets to lists
    skills_list = {k: sorted(list(v)) for k, v in skills.items()}
    
    if category:
        return {
            "category": category,
            "skills": skills_list.get(category.lower(), [])
        }
    
    return {
        "all_skills": skills_list,
        "total_count": sum(len(v) for v in skills_list.values())
    }

async def search_experience(keywords: str, portfolio_data: dict) -> dict:
    """
    Search for specific experience using keywords
    """
    keywords_lower = keywords.lower().split()
    matches = []
    
    for item in portfolio_data.get("star_items", []):
        text = " ".join([
            item.get("title", ""),
            item.get("situation", ""),
            item.get("task", ""),
            item.get("action", ""),
            item.get("result", "")
        ]).lower()
        
        # Calculate match score
        match_count = sum(1 for kw in keywords_lower if kw in text)
        
        if match_count > 0:
            matches.append({
                "title": item.get("title", ""),
                "match_score": match_count,
                "situation": item.get("situation", ""),
                "task": item.get("task", ""),
                "action": item.get("action", ""),
                "result": item.get("result", "")
            })
    
    # Sort by match score
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "keywords": keywords,
        "matches_found": len(matches),
        "results": matches
    }

def extract_technologies(item: Dict) -> List[str]:
    """Extract technology names from a STAR item"""
    text = " ".join([
        item.get("action", ""),
        item.get("result", "")
    ])
    
    tech_keywords = [
        "HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js",
        "Python", "Tailwind", "TypeScript", "Git", "API", "REST",
        "Redis", "Upstash", "Vercel", "WCAG", "Lighthouse"
    ]
    
    found = []
    for tech in tech_keywords:
        if tech.lower() in text.lower():
            found.append(tech)
    
    return found
