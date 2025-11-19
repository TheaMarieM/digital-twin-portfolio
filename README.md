#  Digital Twin Portfolio

> **AI-Powered Portfolio with MCP Integration, RAG System, and Production-Ready Security**

A Next.js portfolio application featuring a digital twin AI assistant powered by Claude Desktop, Groq LLaMA 3.3, and semantic search capabilities. Built with enterprise-grade security, rate limiting, and comprehensive testing.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-MCP_Server-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-orange?style=flat)](https://groq.com/)

---

##  Features

###  **Modern UI/UX**
- **Gradient Theme**: Purple-to-pink gradient design with glassmorphism effects
- **Dark Mode**: Full theme toggle support with CSS custom properties
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Custom Animations**: Smooth transitions, hover effects, and micro-interactions
- **Floating Cat Assistant**: Animated cat button for AI chat navigation
- **Professional Footer**: Social links with gradient hover effects

###  **AI & MCP Integration**
- **Claude Desktop Integration**:  **OPERATIONAL** - Full MCP protocol support
- **7 Production Tools**: Portfolio queries, skills assessment, interview prep, RAG search
- **Digital Twin Assistant**: Context-aware responses about professional experience
- **FastAPI MCP Server**: HTTP and stdio communication modes

###  **RAG System**
- **Semantic Search**: Upstash Vector with 16 embedded portfolio chunks
- **OpenAI Embeddings**: text-embedding-3-small for high-quality vectors
- **Context Retrieval**: Intelligent portfolio data extraction
- **Local Embeddings**: Optional sentence-transformers (384-dim) for development

###  **Enterprise Security**
- **Rate Limiting**: Redis-based distributed rate limiting (20 req/min chat, 30 req/min RAG)
- **Input Validation**: Comprehensive message/query sanitization
- **Content Filtering**: API key detection, password filtering, prompt injection prevention
- **Crypto-Secure Sessions**: 256-bit secure session ID generation
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Session Management**: 100 messages per session limit with automatic cleanup

###  **Data Management**
- **Upstash Redis**: Chat history, session storage, rate limiting
- **STAR Format**: 5 structured professional experience items
- **Interview Q&A**: 10 pre-generated interview training pairs
- **Semantic Cache**: Cosine similarity (0.95 threshold), 100-item capacity, 30-min TTL

---

##  Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** installed
- **Python** 3.8+ with **pip**
- **Upstash** accounts (Redis + Vector)
- **Groq API** key (or OpenAI for embeddings)

### Installation

```bash
# Clone the repository
git clone https://github.com/TheaMarieM/digital-twin-portfolio.git
cd digital-twin-portfolio

# Install Node.js dependencies
pnpm install

# Create Python virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Environment Variables

Create a .env.local file with the following:

```env
# OpenAI (for embeddings)
OPENAI_API_KEY=sk-...

# Groq (for LLM responses)
GROQ_API_KEY=gsk_...

# Upstash Vector
UPSTASH_VECTOR_REST_URL=https://...upstash.io
UPSTASH_VECTOR_REST_TOKEN=...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### Running the Application

```bash
# Start Next.js dev server
pnpm dev
# Open http://localhost:3001

# Start MCP server (optional, for Claude Desktop)
python mcp/server.py
# Server runs on http://127.0.0.1:3000
```

---

##  Architecture

```
my-ai-app/
 app/                        # Next.js App Router
    api/
       chat/              # AI chat endpoint (Groq + LLaMA 3.3)
       rag/               # RAG semantic search endpoint
       metrics/           # Performance metrics
    components/
       sections/          # Page sections (Hero, Skills, Contact)
       ui/                # Reusable UI components
    page.tsx               # Home page with all sections
 mcp/                        # Model Context Protocol Server
    server.py              # FastAPI HTTP server (port 3000)
    stdio_server.py        # stdio MCP server for Claude Desktop
    tools/                 # MCP tool implementations
        portfolio_tools.py # Portfolio queries, projects, skills
        interview_tools.py # Interview Q&A, question generation
        rag_tools.py       # Semantic search, embeddings
 data/
    profile.json           # 5 STAR-format portfolio items
    interview_qa.jsonl     # 10 interview training Q&A pairs
 scripts/
    chat_with_ollama.py    # CLI chat with RAG
    index_local_embeddings.py # Vector database upserter
 docs/
     CLAUDE_DESKTOP_SETUP.md # MCP setup for Claude Desktop
     VERCEL_DEPLOY.md        # Vercel deployment guide
```

---

##  MCP Server

### Available Tools

| Tool | Description |
|------|-------------|
| query_portfolio | Natural language portfolio queries |
| get_projects | List all projects with STAR details |
| get_skills | Extract technical skills by category |
| search_experience | Keyword-based experience search |
| ask_interview_question | Portfolio-based interview answers |
| get_interview_questions | Common interview questions by category |
| semantic_search | RAG-powered semantic search |

---

##  Security Features

### Rate Limiting
- **Chat API**: 20 requests/minute (Redis-based, distributed)
- **RAG API**: 30 requests/minute (in-memory, per-session)

### Input Validation
- **Message Length**: 500 characters max for chat, 300 for RAG
- **Session Messages**: 100 messages per session limit
- **Content Filtering**: API key detection, password filtering, SQL injection prevention

---

##  Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables:
vercel env add OPENAI_API_KEY
vercel env add GROQ_API_KEY
vercel env add UPSTASH_VECTOR_REST_URL
vercel env add UPSTASH_VECTOR_REST_TOKEN
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

---

##  Documentation

- **[CLAUDE_DESKTOP_SETUP.md](docs/CLAUDE_DESKTOP_SETUP.md)**: MCP integration guide
- **[VERCEL_DEPLOY.md](docs/VERCEL_DEPLOY.md)**: Deployment instructions
- **[agents.md](agents.md)**: Copilot coding instructions

---

##  Contact

**Thea Marie**  
- GitHub: [@TheaMarieM](https://github.com/TheaMarieM)
- LinkedIn: [linkedin.com/in/theamarie](https://linkedin.com/in/theamarie)

---

<div align="center">
  <p>Made with  by Thea Marie</p>
</div>
