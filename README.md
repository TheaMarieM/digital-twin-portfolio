This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

**Note:** This project uses `pnpm` as the package manager.

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- 🎨 **Enhanced UI**: Gradient purple-to-pink theme with glassmorphism effects
- 🤖 **AI Chat Assistant**: Powered by Groq + LLaMA 3.3-70b
- 🔍 **RAG System**: Semantic search with Upstash Vector (16 embedded chunks)
- 💾 **Conversation History**: Upstash Redis for session management
- 🎯 **MCP Server**: FastAPI-based server with 7 production tools (port 3000)
- 📱 **Responsive Design**: Mobile-friendly with custom scrollbar and animations
- 🌙 **Dark Mode**: Theme toggle support
- ✨ **Modern UI**: Rounded-full buttons, gradient text, icon badges, professional footer
- 🤖 **Claude Desktop Integration**: ✅ **ACTIVE** - Digital twin assistant
- 📊 **MCP Protocol**: ✅ **WORKING** - Live portfolio data access
- 🎓 **Interview Preparation**: ✅ **READY** - AI-powered practice sessions

## MCP Server Integration

✅ **STATUS: FULLY OPERATIONAL** 

The MCP (Model Context Protocol) server provides live portfolio data access to Claude Desktop:

### Production Tools Available
- **Portfolio Queries**: Direct access to 5 STAR-format projects
- **Skills Assessment**: Technical skills with proficiency levels  
- **Interview Preparation**: AI-powered Q&A generation
- **RAG Semantic Search**: Context-aware portfolio search

### Claude Desktop Usage
```bash
# Example queries that work:
"What are your technical skills?"
"Tell me about your HTML/CSS expertise"
"What projects showcase your accessibility work?"
"Generate interview questions for frontend roles"
```

### Development Access
- **HTTP API**: http://localhost:3000 (7 tools)
- **MCP Protocol**: stdio communication for Claude Desktop
- **Testing**: `python test_mcp_direct.py` for validation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Quick Vercel deployment notes

This repo includes a minimal `vercel.json` and a `docs/VERCEL_DEPLOY.md` with PowerShell-friendly steps to add environment variables and deploy via the Vercel CLI or Dashboard. Important env vars you will need to configure in Vercel:

- `OPENAI_API_KEY` — your OpenAI API key (must be from a billed account for production embeddings)
- `UPSTASH_VECTOR_REST_URL` — Upstash Vector REST endpoint
- `UPSTASH_VECTOR_REST_TOKEN` — Upstash Vector REST token (secret)
- `UPSTASH_VECTOR_INDEX` — vector index name (e.g., `portfolio`)
- `EMBEDDING_MODEL` — optional, e.g. `text-embedding-3-small`

See `docs/VERCEL_DEPLOY.md` for CLI commands and dashboard steps.

### Additional Environment Variables

For full functionality, you'll also need:

- `GROQ_API_KEY` — Groq API key for LLaMA 3.3 integration
- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST endpoint
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token
