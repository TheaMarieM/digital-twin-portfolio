# Deploying to Vercel

This project is Next.js-ready and can be deployed to Vercel. This doc shows recommended steps, environment variables to add (secrets), and PowerShell-friendly commands for the Vercel CLI.

Prereqs
- Sign up for a Vercel account and connect your GitHub repository (or import manually).
- Install the Vercel CLI locally if you want to manage env vars from the terminal: `npm i -g vercel` (or `pnpm add -g vercel`).

Recommended environment variables (secrets)
You must set these in Vercel (Dashboard > Project > Settings > Environment Variables) or with the Vercel CLI. Do NOT commit these to the repo.

- OPENAI_API_KEY — OpenAI API key (production key on a billed account). Required for embeddings/chat.
- UPSTASH_VECTOR_REST_URL — Upstash Vector REST endpoint (from Upstash console).
- UPSTASH_VECTOR_REST_TOKEN — Upstash Vector REST token (secret).
- UPSTASH_VECTOR_INDEX — Index name (e.g., `portfolio`).
- EMBEDDING_MODEL — (optional) model name for embeddings (e.g., `text-embedding-3-small`).
- EMBEDDING_DIM — (optional) dim (e.g., `1536`).

Set environment variables with the Vercel Dashboard (recommended)
1. Go to your Vercel project.
2. Settings → Environment Variables → Add Variable.
3. Add the names above and select the environment (Preview/Production). Paste secret values.

Set environment variables with the Vercel CLI (PowerShell)
1. Login to Vercel in your terminal (one-time):

```powershell
vercel login
```

2. Add a secret and attach it as an env var (PowerShell example to add OPENAI_API_KEY):

```powershell
# add secret interactively (vercel will prompt for the value)
vercel env add OPENAI_API_KEY production

# OR add a secret value directly (not recommended in shared logs):
# $val = Read-Host -AsSecureString "OpenAI Key" ; vercel env add OPENAI_API_KEY production --value (ConvertFrom-SecureString $val)
```

Repeat for `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`, and `UPSTASH_VECTOR_INDEX`.

Deploying
- Connect your repository to Vercel using the dashboard. Push to the main branch and Vercel will run the build command from `vercel.json` (pnpm build).
- Or run from local CLI (for quick preview):

```powershell
vercel --prod
```

Notes & tips
- If you use pnpm locally and the project contains `pnpm-lock.yaml`, Vercel will detect and use pnpm automatically; `vercel.json` sets `pnpm build` explicitly.
- Keep function memory/duration conservative in `vercel.json` and increase if your RAG endpoint needs more time.
- After deployment, verify `/api/test` and `/api/metrics` endpoints from the deployed URL to confirm env vars are active.
- If embeddings fail with quota/429 on Vercel, verify `OPENAI_API_KEY` points to a billed OpenAI account and is set in the Production variables on Vercel.

Security
- Use Vercel Secrets for highly sensitive values (the Dashboard already hides values). Rotate keys periodically.

Troubleshooting
- Build fails with module errors: verify Node version and Next version compatibility in Vercel project settings.
- Runtime 500s for /api/*: check Function logs in Vercel dashboard and confirm env vars are present.
