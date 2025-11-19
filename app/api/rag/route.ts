import { NextRequest, NextResponse } from "next/server";
import profile from "@/data/profile.json";
import { getEmbedding } from "@/lib/embeddings";
import { topKBySimilarity, EmbeddedChunk } from "@/lib/vector";

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60000,
  maxQueryLength: 300,
};

// In-memory rate limiting (use Redis for production multi-instance setup)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs
    });
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 };
  }
  
  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// Input validation
function validateQuery(query: unknown): { valid: boolean; error?: string } {
  if (!query || typeof query !== "string") {
    return { valid: false, error: "Query must be a non-empty string" };
  }
  
  if (query.length > RATE_LIMIT.maxQueryLength) {
    return { valid: false, error: `Query exceeds maximum length of ${RATE_LIMIT.maxQueryLength} characters` };
  }
  
  if (query.trim().length < 3) {
    return { valid: false, error: "Query too short, minimum 3 characters required" };
  }
  
  // Check for injection attempts
  const suspiciousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /<iframe/gi,
    /eval\(/gi,
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(query)) {
      return { valid: false, error: "Query contains invalid content" };
    }
  }
  
  return { valid: true };
}

// Build chunks from STAR data
const rawChunks = (profile.star_items || []).flatMap((item: any) => {
  const base = { id: item.id, title: item.title };
  return [
    { ...base, section: "Situation", content: item.situation },
    { ...base, section: "Task", content: item.task },
    { ...base, section: "Action", content: item.action },
    { ...base, section: "Result", content: item.result },
  ];
});

let embedded: EmbeddedChunk[] | null = null;

// ---- Simple Semantic Cache ----
type CacheItem = {
  q: string;
  qEmbed: number[];
  answer: string;
  quality: { groundedness: number; coverage: number; overall: number };
  ts: number;
};

const CACHE = {
  items: [] as CacheItem[],
  capacity: 100,  // Increased capacity
  ttlMs: 1000 * 60 * 30,  // 30 minutes TTL
  hits: 0,
  misses: 0,
  requests: 0,
  totalLatencyMs: 0,
};

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  CACHE.items = CACHE.items.filter(item => now - item.ts <= CACHE.ttlMs);
}, 60000);

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

function getFromCache(qEmbed: number[], threshold = 0.95): CacheItem | null {
  const now = Date.now();
  let best: { item: CacheItem; sim: number } | null = null;

  for (const it of CACHE.items) {
    if (now - it.ts > CACHE.ttlMs) continue;
    const sim = cosine(qEmbed, it.qEmbed);
    if (!best || sim > best.sim) best = { item: it, sim };
  }

  return best && best.sim >= threshold ? best.item : null;
}

function putInCache(item: CacheItem) {
  CACHE.items.unshift(item);
  if (CACHE.items.length > CACHE.capacity) CACHE.items.pop();
}

// ---- Embedding the STAR chunks ----
async function ensureIndex() {
  if (embedded) return embedded;

  console.log("📌 Building embedding index for STAR items...");

  const chunksWithEmbeddings: EmbeddedChunk[] = [];
  for (const c of rawChunks) {
    const text = `${c.title} — ${c.section}: ${c.content}`;
    const embedding = await getEmbedding(text); // must return number[]

    chunksWithEmbeddings.push({
      id: `${c.id}-${c.section.toLowerCase()}`,
      title: `${c.title} (${c.section})`,
      content: c.content,
      meta: { itemId: c.id, section: c.section },
      embedding,
    });
  }

  embedded = chunksWithEmbeddings;
  console.log("✅ Embedding index ready.");
  return embedded;
}

// ---- Build prompt ----
function buildPrompt(query: string, contexts: Array<EmbeddedChunk & { score: number }>) {
  const contextText = contexts
    .map(
      (c, i) =>
        `[#${i + 1}] Title: ${c.title}\nSection: ${c.meta?.section}\nContent: ${c.content}`
    )
    .join("\n\n");

  return `You are a professional interview assistant for ${profile.owner}, ${profile.role}.
Use ONLY the provided context to answer recruiter-style queries with STAR clarity.
Cite sources as [#index] when relevant.

Context:
${contextText}

User question: ${query}

Answer:`;
}

// ---- Generate answer with OpenAI ----
async function generateAnswer(prompt: string): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    throw new Error("No available API key for text generation. Set OPENAI_API_KEY in your environment.");
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful, concise career assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ OpenAI API error:", res.status, text);
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "";
  } catch (e) {
    console.error("OpenAI API error:", e);
    throw e;
  }
}

// ---- POST handler ----
export async function POST(req: NextRequest) {
  try {
    const start = Date.now();
    
    // Security: Get client identifier for rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0].trim() : "unknown";
    
    // Security: Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please wait before making more requests.",
          retryAfter: Math.ceil(RATE_LIMIT.windowMs / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'Retry-After': Math.ceil(RATE_LIMIT.windowMs / 1000).toString()
          }
        }
      );
    }
    
    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "API configuration is incomplete. Please contact the administrator." },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { query } = body;

    // Security: Validate input
    const validation = validateQuery(query);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let index;
    try {
      index = await ensureIndex();
    } catch (err: any) {
      const msg = String(err?.message || err);
      console.error("Embedding initialization error:", msg);
      if (/quota|insufficient_quota|429/i.test(msg)) {
        return NextResponse.json({ error: "Embeddings provider quota exceeded. Please check billing or rotate OPENAI_API_KEY." }, { status: 503 });
      }
      return NextResponse.json({ error: "Failed to build embedding index" }, { status: 500 });
    }

    let qEmbed: number[];
    try {
      qEmbed = await getEmbedding(query);
    } catch (err: any) {
      const msg = String(err?.message || err);
      console.error("Query embedding error:", msg);
      if (/quota|insufficient_quota|429/i.test(msg)) {
        return NextResponse.json({ error: "Embeddings provider quota exceeded. Please check billing or rotate OPENAI_API_KEY." }, { status: 503 });
      }
      return NextResponse.json({ error: "Failed to generate query embedding" }, { status: 500 });
    }

    // Try cache
    const cached = getFromCache(qEmbed);
    if (cached) {
      const latencyMs = Date.now() - start;
      CACHE.hits++;
      CACHE.requests++;
      CACHE.totalLatencyMs += latencyMs;

      return NextResponse.json(
        {
          answer: cached.answer,
          quality: cached.quality,
          sources: [],
          meta: { cached: true, latencyMs },
        },
        {
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'X-Cache': 'HIT'
          }
        }
      );
    }

    // Vector search
    const top = topKBySimilarity(qEmbed, index, 6);
    const avgSim = top.reduce((s, t) => s + t.score, 0) / top.length;
    const uniqueSections = new Set(top.map((t) => t.meta?.section)).size;

    const prompt = buildPrompt(query, top);
    const answer = await generateAnswer(prompt);

    const quality = {
      groundedness: Number(avgSim.toFixed(3)),
      coverage: uniqueSections,
      overall: Number(
        ((avgSim * 0.7) + Math.min(1, uniqueSections / 4) * 0.3).toFixed(3)
      ),
    };

    // Store in cache
    putInCache({ q: query, qEmbed, answer, quality, ts: Date.now() });

    const latencyMs = Date.now() - start;
    CACHE.misses++;
    CACHE.requests++;
    CACHE.totalLatencyMs += latencyMs;

    return NextResponse.json(
      {
        answer,
        quality,
        sources: top.map((t, i) => ({
          id: t.id,
          title: t.title,
          section: t.meta?.section,
          score: Number(t.score.toFixed(3)),
          index: i + 1,
        })),
        meta: { cached: false, latencyMs },
      },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (e: any) {
    console.error("❌ SERVER ERROR:", e);
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
