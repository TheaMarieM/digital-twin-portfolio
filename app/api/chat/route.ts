import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 20,  // Max requests per window
  windowMs: 60000,  // 1 minute window
  maxMessageLength: 500,  // Max characters per message
  maxSessionMessages: 100,  // Max messages per session
};

// Security: Check rate limit
async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rateLimit:${identifier}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, Math.floor(RATE_LIMIT.windowMs / 1000));
  }
  
  return {
    allowed: current <= RATE_LIMIT.maxRequests,
    remaining: Math.max(0, RATE_LIMIT.maxRequests - current)
  };
}

// Security: Validate and sanitize input
function validateInput(message: string): { valid: boolean; error?: string } {
  if (!message || typeof message !== "string") {
    return { valid: false, error: "Message must be a non-empty string" };
  }
  
  if (message.length > RATE_LIMIT.maxMessageLength) {
    return { valid: false, error: `Message exceeds maximum length of ${RATE_LIMIT.maxMessageLength} characters` };
  }
  
  // Check for potential injection attempts
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return { valid: false, error: "Message contains potentially harmful content" };
    }
  }
  
  return { valid: true };
}

// Security: Generate session ID with better entropy
function generateSecureSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

const LLM_PROVIDER = process.env.LLM_PROVIDER ?? "ollama";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";
const MAX_HISTORY_MESSAGES = Number(process.env.MAX_HISTORY_MESSAGES ?? 20);

// Load portfolio data for RAG
let portfolioContext = "";
try {
  const profilePath = path.join(process.cwd(), "data", "profile.json");
  const profileData = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  const starItems = profileData.star_items || [];
  
  // Build context from top items
  const contextParts = starItems.slice(0, 8).map((item: any) => {
    let ctx = `**${item.title || ""}**\n`;
    if (item.situation) ctx += `Situation: ${item.situation}\n`;
    if (item.task) ctx += `Task: ${item.task}\n`;
    if (item.action) ctx += `Action: ${item.action}\n`;
    if (item.result) ctx += `Result: ${item.result}\n`;
    return ctx;
  });
  
  portfolioContext = contextParts.join("\n\n");
} catch (err) {
  console.warn("Failed to load portfolio data:", err);
}

type Body = { message?: string; sessionId?: string };

function buildPromptFromHistory(history: any[], userMessage: string) {
  // Check if this is a repeated question
  const previousQuestions = history.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
  const currentQuestionLower = userMessage.toLowerCase();
  const isRepeatedQuestion = previousQuestions.some(q => 
    q.includes(currentQuestionLower.split(' ').slice(0, 3).join(' ')) ||
    currentQuestionLower.includes(q.split(' ').slice(0, 3).join(' '))
  );

  // Build RAG prompt with natural, conversational tone
  let prompt = `You are Marithea Magno, a third-year IT student answering questions about your professional background. Respond naturally and conversationally as yourself in first person.

IMPORTANT GUIDELINES:
- Never use asterisks (*) or markdown formatting in responses
- Speak naturally like you're having a casual conversation with a potential employer or colleague
- Vary your responses - if asked similar questions before, provide different angles or examples
- Be specific about your actual projects and experiences
- Use natural transitions and conversational connectors
- Show enthusiasm about your work without being overly formal
- Keep responses focused but personable (2-4 sentences typically)

Your Background:
${portfolioContext}

${isRepeatedQuestion ? `
VARIATION NOTE: You've been asked similar questions before. Provide a fresh perspective, different examples, or additional details you haven't mentioned yet.
` : ''}

Conversation style examples:
- Instead of: "I have experience with *web development*"
- Say: "I've been working on web development projects, actually built a few full-stack apps that I'm pretty excited about"

- Instead of: "*Currently* I am working on..."
- Say: "Right now I'm focused on..." or "These days I've been diving into..."`;

  // Add conversation history with natural flow
  if (history.length > 0) {
    prompt += "\n\nPrevious conversation:\n";
    history.slice(-6).forEach((m) => {  // Only include last 6 messages for context
      const role = m.role === 'assistant' ? 'You' : 'Them';
      prompt += `${role}: ${m.content}\n`;
    });
  }

  // Add current question with natural prompt
  prompt += `\n\nThem: ${userMessage}\nYou: `;
  
  return prompt;
}

// Security: Filter out sensitive information and prompt injections
function filterSensitiveContent(text: string): string {
  // Remove potential API keys, tokens, passwords
  let filtered = text.replace(/\b[A-Za-z0-9_-]{32,}\b/g, '[REDACTED]');
  filtered = filtered.replace(/\bpassword\s*[:=]\s*\S+/gi, 'password: [REDACTED]');
  filtered = filtered.replace(/\bapi[_-]?key\s*[:=]\s*\S+/gi, 'api_key: [REDACTED]');
  filtered = filtered.replace(/\btoken\s*[:=]\s*\S+/gi, 'token: [REDACTED]');
  
  // Remove system prompt attempts
  filtered = filtered.replace(/ignore (previous|all) instructions?/gi, '');
  filtered = filtered.replace(/you are now/gi, '');
  filtered = filtered.replace(/system:\s*/gi, '');
  
  return filtered;
}

// Add function to clean up response and ensure natural flow
function cleanupResponse(response: string): string {
  // Security: Filter sensitive content first
  let cleaned = filterSensitiveContent(response);
  
  // Remove asterisks and markdown
  cleaned = cleaned.replace(/\*+/g, '');
  
  // Remove common markdown patterns
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
  cleaned = cleaned.replace(/`(.*?)`/g, '$1');
  
  // Fix common AI-speak patterns
  cleaned = cleaned.replace(/\bAs an? (AI|assistant|chatbot)\b/gi, '');
  cleaned = cleaned.replace(/\bI'm (an AI|a language model|here to help)\b/gi, '');
  
  // Make more conversational
  cleaned = cleaned.replace(/\bI have experience with\b/gi, "I've worked with");
  cleaned = cleaned.replace(/\bI am currently\b/gi, "I'm currently");
  cleaned = cleaned.replace(/\bI would be happy to\b/gi, "I'd be happy to");
  cleaned = cleaned.replace(/\bI have been\b/gi, "I've been");
  cleaned = cleaned.replace(/\bI would like to\b/gi, "I'd like to");
  
  // Remove redundant phrases
  cleaned = cleaned.replace(/\b(Well, |So, )+/g, '');
  cleaned = cleaned.replace(/\b(Additionally|Furthermore|Moreover),?\s*/gi, '');
  
  // Clean up spacing and formatting
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\s+([,.!?])/g, '$1');
  cleaned = cleaned.trim();
  
  // Ensure it ends properly
  if (cleaned && !cleaned.match(/[.!?]$/)) {
    cleaned += '.';
  }
  
  return cleaned;
}

export async function POST(req: Request) {
  try {
    // Security: Get client identifier for rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(',')[0].trim() : "unknown";
    
    const body: Body = await req.json().catch(() => ({} as Body));
    const { message, sessionId } = body;

    // Security: Validate input
    const validation = validateInput(message || "");
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // After validation, message is guaranteed to be a valid string
    const userMessage = message!;

    // Security: Check rate limit
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please wait before sending more messages.",
          retryAfter: Math.ceil(RATE_LIMIT.windowMs / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT.windowMs).toISOString()
          }
        }
      );
    }

    // Security: Use secure session ID or generate one
    const sid = sessionId && /^[a-f0-9]{64}$/.test(sessionId) 
      ? sessionId 
      : generateSecureSessionId();
    const key = `chatHistory:${sid}`;

    // Read recent history (LPUSH stores newest-first; we want chronological)
    // @upstash/redis automatically deserializes JSON, so raw is already an array of objects
    const raw = await redis.lrange<{ role: string; content: string }>(key, 0, MAX_HISTORY_MESSAGES - 1);
    const history = (raw || []).slice().reverse();
    
    // Security: Check session message limit
    const sessionMessageCount = await redis.get<number>(`sessionCount:${sid}`) || 0;
    if (sessionMessageCount >= RATE_LIMIT.maxSessionMessages) {
      return NextResponse.json(
        { error: "Session message limit reached. Please start a new session." },
        { status: 429 }
      );
    }

    // Build messages for the model
    const messagesForModel = [...history, { role: "user", content: userMessage }];

    let botMessage = "";

    if (LLM_PROVIDER === "groq") {
      // Use Groq with LLaMA 3.3
      const prompt = buildPromptFromHistory(history, userMessage);

      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "system", content: prompt }, { role: "user", content: userMessage }],
          temperature: 0.8,  // Increased for more variety
          max_tokens: 800,   // Reduced for more concise responses
          top_p: 0.9,        // Add top_p for better variety
          frequency_penalty: 0.3,  // Reduce repetition
          presence_penalty: 0.2,   // Encourage new topics
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Groq error", resp.status, text);
        return NextResponse.json({ error: "Groq API error", details: text }, { status: 502 });
      }

      const data = await resp.json();
      const rawResponse = data.choices?.[0]?.message?.content ?? "";
      botMessage = cleanupResponse(rawResponse);

    } else if (LLM_PROVIDER === "ollama") {
      // Use Ollama for local processing
      const prompt = buildPromptFromHistory(history, userMessage);

      const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          options: {
            temperature: 0.8,  // Increased for more variety
            top_p: 0.9,
            frequency_penalty: 0.3,
            presence_penalty: 0.2,
            num_predict: 800
          }
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Ollama error", resp.status, text);
        return NextResponse.json({ error: "Ollama error", details: text }, { status: 502 });
      }

      const data = await resp.json();
      const rawResponse = (data?.response ?? "").toString().trim();
      botMessage = cleanupResponse(rawResponse);

    } else {
      return NextResponse.json({ error: "Invalid LLM_PROVIDER. Use 'groq' or 'ollama'" }, { status: 400 });
    }

    // Persist messages to Redis (LPUSH newest-first), keep trimming
    // @upstash/redis automatically serializes objects to JSON
    await redis.lpush(key, { role: "user", content: userMessage });
    await redis.lpush(key, { role: "assistant", content: botMessage });
    await redis.ltrim(key, 0, MAX_HISTORY_MESSAGES - 1);
    
    // Update session message counter
    await redis.incr(`sessionCount:${sid}`);
    await redis.expire(`sessionCount:${sid}`, Number(process.env.SESSION_TTL_SECONDS ?? 86400));
    
    // Set TTL for the conversation
    await redis.expire(key, Number(process.env.SESSION_TTL_SECONDS ?? 86400));

    return NextResponse.json(
      { 
        message: botMessage,
        sessionId: sid,
        meta: {
          messagesRemaining: Math.max(0, RATE_LIMIT.maxSessionMessages - (sessionMessageCount + 1)),
          requestsRemaining: rateLimit.remaining
        }
      },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    );
  } catch (err) {
    console.error("/api/chat error", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
 
