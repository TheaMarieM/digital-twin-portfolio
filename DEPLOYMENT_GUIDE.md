# 🚀 Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon → "New repository"
3. Repository name: `digital-twin-portfolio`
4. Description: `AI-powered portfolio with MCP server for Claude Desktop integration`
5. Make it **Public** (required for Vercel free tier)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands:

```powershell
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/digital-twin-portfolio.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: digital-twin-portfolio
# - Directory: ./
# - Override settings? No
```

### Option B: Vercel Dashboard
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `digital-twin-portfolio`
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`

## Step 4: Configure Environment Variables

In Vercel dashboard, add these environment variables:

### Required Variables
```bash
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_token
UPSTASH_REDIS_REST_URL=your_upstash_redis_url  
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### Optional Variables
```bash
UPSTASH_VECTOR_INDEX=portfolio
EMBEDDING_MODEL=text-embedding-3-small
```

## Step 5: Verify Deployment

1. Your app will be available at: `https://your-project-name.vercel.app`
2. Test the AI chat functionality
3. Verify RAG search is working
4. Check that environment variables are properly loaded

## Important Notes

⚠️ **MCP Server**: The MCP server (`mcp/server.py`) won't run on Vercel since it's a serverless platform. MCP functionality is for local Claude Desktop integration only.

✅ **What Works on Vercel**:
- Next.js portfolio website
- AI chat with Groq/OpenAI
- RAG search with Upstash Vector
- All portfolio data and interview features

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check that `package.json` has correct scripts
- Verify TypeScript types are correct

### Runtime Errors
- Check Vercel function logs
- Ensure API keys are valid
- Verify Upstash services are accessible

### Performance
- Vercel free tier has function execution limits
- Consider upgrading for production use
- Monitor usage in Vercel dashboard

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub  
3. ✅ Deploy to Vercel
4. ✅ Configure environment variables
5. ✅ Test deployment
6. 🔄 Set up custom domain (optional)
7. 🔄 Configure analytics (optional)