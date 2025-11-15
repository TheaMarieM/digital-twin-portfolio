# Digital Twin MCP Server Project Instructions

## Project Overview
Build an MCP server to create a digital twin assistant that can answer questions about a person's professional profile using RAG (Retrieval-Augmented Generation).

## Reference Repositories
- **MCP Pattern Reference**: FastAPI-based HTTP server for MCP protocol
- **RAG Logic**: Python implementation using Upstash Vector for RAG search with Ollama for LLM generation

## Core Functionality
- MCP server accepts user questions about professional background
- Server actions search Upstash Vector database and return RAG results
- Integration with Ollama (local LLM) for intelligent responses
- Search logic uses sentence-transformers embeddings (384-dim)

## Environment Variables (.env.local)
```
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
OPENAI_API_KEY=
```

## Technical Requirements
- **Framework**: Next.js 16.0.1
- **Package Manager**: pnpm (configured and in use)
- **Commands**: Windows PowerShell
- **Dev Server Port**: 3001 (Next.js)
- **MCP Server Port**: 3000 (FastAPI)
- **Type Safety**: Enforce strong TypeScript type safety throughout
- **Architecture**: Always use server actions where possible
- **Styling**: Use globals.css instead of inline styling
- **UI Framework**: ShadCN with dark mode theme
- **Focus**: Prioritize MCP functionality over UI - UI is primarily for MCP server configuration

## MCP Server Architecture
- **Python Backend**: FastAPI server at http://127.0.0.1:3000
- **7 Production Tools**: portfolio queries, interview Q&A, RAG semantic search
- **CORS Enabled**: Portfolio (port 3001) ↔ MCP server (port 3000)
- **Data Source**: data/profile.json with STAR-format professional profile
- **Vector Store**: Upstash Vector with 20 embedded vectors (384-dim)
- **Session Store**: Upstash Redis for chat history

## Setup Commands
```bash
# Python environment
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Node.js dependencies
pnpm install

# Start MCP server
python mcp/server.py

# Start Next.js dev server
pnpm dev
```

## Upstash Vector Integration

### Key Documentation
- Getting Started: https://upstash.com/docs/vector/overall/getstarted
- Embedding Models: https://upstash.com/docs/vector/features/embeddingmodels
- TypeScript SDK: https://upstash.com/docs/vector/sdks/ts/getting-started
- REST API: https://upstash.com/docs/vector/api/endpoints

### Example Implementation
```typescript
import { Index } from "@upstash/vector"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// RAG search example
const results = await index.query({
  data: "What is my experience?",
  topK: 3,
  includeMetadata: true,
})
```

### Current Implementation Status
- ✅ Local embeddings working (sentence-transformers, 384-dim)
- ✅ 16 vectors successfully upserted to Upstash Vector
- ✅ RAG pipeline integrated with Groq + LLaMA 3.3
- ✅ Python MCP server with 7 tools running on port 3000
- ✅ Next.js chat API integrated with portfolio context
- ✅ Interview training with 10 Q&A pairs generated
- ✅ Enhanced UI with gradient theme and glassmorphism
- ✅ Professional footer with social links
- ✅ Custom purple-pink gradient scrollbar
- ✅ Responsive design with dark mode support

## LLM Integration
- **Cloud LLM**: Groq API (https://groq.com)
- **Model**: LLaMA 3.3-70b-versatile
- **Use Case**: Generate intelligent, portfolio-specific responses
- **Features**: Fast inference, streaming responses, high-quality outputs
- **Fallback**: OpenAI API compatible

## Project Structure
```
my-ai-app/
├── app/                    # Next.js app router
│   ├── api/
│   │   ├── chat/          # Main chat endpoint with RAG
│   │   └── rag/           # RAG endpoint
│   └── page.tsx           # Chat interface
├── data/
│   ├── profile.json       # Professional profile (5 STAR items)
│   └── interview_qa.jsonl # Generated interview Q&A
├── mcp/
│   ├── server.py          # FastAPI MCP server (port 8001)
│   ├── tools/             # 7 production tools
│   │   ├── portfolio_tools.py
│   │   ├── interview_tools.py
│   │   └── rag_tools.py
│   ├── config.json        # MCP configuration
│   ├── README.md          # MCP documentation
│   └── TESTING.md         # Testing instructions
├── scripts/
│   ├── chat_with_ollama.py      # CLI chat with RAG
│   ├── index_local_embeddings.py # Vector upserter
│   ├── quick_interview.py       # Interview Q&A generator
│   └── demo_portfolio_chat.py   # Demo script
├── lib/
│   ├── embeddings.ts      # Embedding utilities
│   └── vector.ts          # Vector DB utilities
├── agents.md              # This file - Copilot instructions
└── .env.local             # Environment variables
```

## Development Workflow
1. **Backend First**: Test RAG logic in Python scripts
2. **MCP Server**: Expose tools via FastAPI HTTP server
3. **Next.js Integration**: Connect frontend to MCP server
4. **Testing**: Validate all tools work correctly
5. **Deployment**: Deploy to Vercel for production access

## Key Features Status
- [x] Professional profile system (profile.json)
- [x] Local embeddings and vector storage
- [x] RAG system with Groq + LLaMA 3.3
- [x] MCP server with 7 tools
- [x] Interview Q&A generation
- [x] Enhanced UI with gradient theme
- [x] Professional footer with social links
- [x] Custom scrollbar and animations
- [x] Responsive design with dark mode
- [x] **Claude Desktop integration** ✅ **OPERATIONAL**
- [x] **MCP Protocol Implementation** ✅ **LIVE**
- [x] **Portfolio Digital Twin** ✅ **RESPONDING**
- [ ] Real job posting simulation
- [ ] Vercel deployment with MCP hosting

## Best Practices
- Test Python scripts before integrating into Next.js
- Use direct JSON arrays for Upstash REST API
- Handle Ollama streaming with newline-delimited JSON parser
- Load portfolio context on server startup
- Use TypeScript types from `typing` module for Python 3.8 compatibility
- Keep environment variables secure (never commit .env.local)

## Additional Resources
- MCP Protocol: https://modelcontextprotocol.io/
- Upstash Documentation: https://upstash.com/docs
- Groq API: https://groq.com
- Next.js Documentation: https://nextjs.org/docs
- FastAPI Documentation: https://fastapi.tiangolo.com/
- Tailwind CSS: https://tailwindcss.com/docs

---

**Note**: This file provides context for GitHub Copilot to generate accurate, project-specific code suggestions. Keep it updated as requirements evolve.
