"""
Interview Simulation Script for Job Posting Testing
Run comprehensive interview simulations based on job postings
"""

import json
import os
from pathlib import Path

def load_job_posting(job_file: str) -> str:
    """Load job posting content from file"""
    job_path = Path("job-postings") / job_file
    
    if not job_path.exists():
        print(f"❌ Job posting not found: {job_path}")
        return None
    
    with open(job_path, "r", encoding="utf-8") as f:
        return f.read()

def load_profile_data() -> dict:
    """Load profile data for context"""
    profile_path = Path("data") / "profile.json"
    
    if not profile_path.exists():
        print("❌ Profile data not found")
        return None
    
    with open(profile_path, "r", encoding="utf-8") as f:
        return json.load(f)

def generate_interview_prompt(job_content: str, interview_type: str) -> str:
    """Generate interview simulation prompt based on type"""
    
    prompts = {
        "screening": """
You are a senior recruiter conducting a CRITICAL initial phone screening interview.

JOB POSTING:
{job_content}

IMPORTANT: You are HIGHLY SELECTIVE and CRITICAL. Only candidates who meet ALL essential requirements should pass.

**Phase 1 - Initial Screening (15 minutes)**

Check these CRITICAL factors:
1. Location compatibility - Can they work hybrid in the specified location?
2. Salary expectations - Are they aligned with the offered range?
3. ALL mandatory requirements met - Go through each essential requirement
4. Experience level - Do they have the required years of experience?
5. Availability - When can they start?

Ask 5-6 probing screening questions. Be specific and dig into details.

**Phase 2 - Assessment Report**

Provide:
- PASS/FAIL recommendation (be critical)
- Overall suitability score (1-10)
- Key strengths identified
- Red flags or concerns
- Salary/location alignment
- Recommended next steps

Remember: It's better to reject a candidate in screening than waste time in technical interviews.
""",
        
        "technical": """
You are a senior software engineer conducting a DETAILED technical interview.

JOB POSTING:
{job_content}

Focus on DEEP TECHNICAL ASSESSMENT:

**Phase 1 - Technical Skills Validation (20 minutes)**
- Specific programming languages mentioned in job posting
- Years of experience with each required technology
- Depth of knowledge (junior, mid, senior, expert level)
- Real project examples using these technologies

**Phase 2 - Problem Solving (15 minutes)**
- Present a system design challenge related to the role
- Assess architectural thinking and trade-offs
- Code quality and best practices approach
- Testing and debugging methodology

**Phase 3 - Technical Competency Matrix**
Rate each required skill (1-5):
- Technical skill from job posting: X/5
- Provide evidence for each rating

**Phase 4 - Final Technical Assessment**
- HIRE/NO HIRE recommendation
- Technical competency score (1-10)
- Strengths and weaknesses
- Areas of concern
- Recommended follow-up technical questions
""",
        
        "behavioral": """
You are an experienced hiring manager conducting a BEHAVIORAL interview using the STAR method.

JOB POSTING:
{job_content}

Focus on BEHAVIORAL COMPETENCIES:

**Phase 1 - Leadership & Teamwork (15 minutes)**
Ask 3-4 STAR format questions:
- "Tell me about a time you led a technical decision that faced resistance"
- "Describe a situation where you had to mentor a struggling team member"
- "Give an example of resolving a conflict within your development team"

**Phase 2 - Problem Solving & Adaptability (15 minutes)**
- "Describe a time you faced a critical production issue"
- "Tell me about learning a new technology under time pressure"
- "Explain a project where requirements changed significantly mid-way"

**Phase 3 - Cultural Fit Assessment**
- Working style and collaboration approach
- Communication with non-technical stakeholders
- Handling stress and deadlines
- Career motivation and growth mindset

**Phase 4 - Behavioral Assessment Report**
- Overall behavioral score (1-10)
- STAR response quality assessment
- Cultural fit evaluation
- Leadership potential
- Red flags or concerns
- HIRE/NO HIRE recommendation
""",
        
        "executive": """
You are a VP of Engineering conducting a STRATEGIC final-round interview.

JOB POSTING:
{job_content}

Focus on STRATEGIC THINKING & LEADERSHIP:

**Phase 1 - Strategic Vision (10 minutes)**
- "Where do you see this role evolving in 2-3 years?"
- "How would you contribute to our technical strategy?"
- "What innovations would you bring to our engineering team?"

**Phase 2 - Business Impact (10 minutes)**
- "How do you balance technical excellence with business delivery?"
- "Describe your approach to technical debt vs new features"
- "How do you measure engineering success?"

**Phase 3 - Leadership Assessment (10 minutes)**
- Leadership philosophy and examples
- Influence without authority
- Building high-performing teams
- Executive presence

**Phase 4 - Executive Assessment**
- Strategic thinking score (1-10)
- Leadership potential rating
- Business acumen assessment
- Long-term fit evaluation
- FINAL HIRE/NO HIRE decision
"""
    }
    
    return prompts[interview_type].format(job_content=job_content)

def main():
    print("🎯 Interview Simulation Tool")
    print("=" * 60)
    
    # Load job posting
    job_content = load_job_posting("job1.md")
    if not job_content:
        return
    
    print("✅ Loaded job posting: job1.md")
    print()
    
    # Load profile
    profile = load_profile_data()
    if not profile:
        return
    
    print("✅ Loaded professional profile")
    print()
    
    print("📋 Available Interview Types:")
    print("1. Screening - HR/Recruiter initial phone screen")
    print("2. Technical - Deep technical assessment")
    print("3. Behavioral - STAR method behavioral interview")
    print("4. Executive - Strategic leadership interview")
    print()
    
    print("=" * 60)
    print()
    print("🤖 INSTRUCTIONS FOR USE:")
    print()
    print("**Option 1: Using GitHub Copilot in VS Code**")
    print("-" * 60)
    print("1. Open GitHub Copilot Chat in VS Code")
    print("2. Copy one of the prompts below")
    print("3. Add: '@workspace' at the start")
    print("4. Add: 'Use my digital twin MCP server data and the job posting in job-postings/job1.md'")
    print("5. Paste the interview type prompt")
    print()
    
    print("**Option 2: Using Claude Desktop**")
    print("-" * 60)
    print("1. Ensure MCP server is running (python mcp/server.py)")
    print("2. Run: npx -y mcp-remote http://localhost:8001")
    print("3. Open Claude Desktop")
    print("4. Copy the job posting content from job-postings/job1.md")
    print("5. Paste interview type prompt and job content")
    print()
    
    print("=" * 60)
    print()
    print("📝 INTERVIEW PROMPTS:")
    print()
    
    interview_types = {
        "screening": "HR/Recruiter Screening Interview",
        "technical": "Technical Interview with Senior Engineer",
        "behavioral": "Behavioral Interview with Hiring Manager",
        "executive": "Executive Interview with VP of Engineering"
    }
    
    for key, title in interview_types.items():
        print(f"\n{'=' * 60}")
        print(f"🎯 {title.upper()}")
        print(f"{'=' * 60}\n")
        
        prompt = generate_interview_prompt(job_content, key)
        print(prompt)
        print()
        
        print(f"\n💡 USAGE TIP:")
        print(f"Copy the prompt above and use with:")
        print(f"- GitHub Copilot: '@workspace [paste prompt] using my MCP server'")
        print(f"- Claude Desktop: '[paste prompt] based on my profile data'\n")
    
    print("\n" + "=" * 60)
    print("✅ Interview simulation prompts generated!")
    print("=" * 60)
    print()
    print("📌 NEXT STEPS:")
    print("1. Ensure MCP server is running: python mcp/server.py")
    print("2. Choose an interview type above")
    print("3. Copy the prompt to GitHub Copilot or Claude Desktop")
    print("4. Practice your interview responses")
    print("5. Use feedback to improve your profile.json")
    print()

if __name__ == "__main__":
    main()
