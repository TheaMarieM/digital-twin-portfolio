import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

// Add function to clean up response and ensure natural flow
function cleanupResponse(response: string): string {
  // Remove asterisks and markdown
  let cleaned = response.replace(/\*+/g, '');
  
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
    const body: Body = await req.json().catch(() => ({} as Body));
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "missing 'message'" }, { status: 400 });
    }

    const sid = sessionId ?? "anonymous";
    const key = `chatHistory:${sid}`;

    // Read recent history (LPUSH stores newest-first; we want chronological)
    // @upstash/redis automatically deserializes JSON, so raw is already an array of objects
    const raw = await redis.lrange<{ role: string; content: string }>(key, 0, MAX_HISTORY_MESSAGES - 1);
    const history = (raw || []).slice().reverse();

    // Build messages for the model
    const messagesForModel = [...history, { role: "user", content: message }];

    let botMessage = "";

    if (LLM_PROVIDER === "groq") {
      // Use Groq with LLaMA 3.3
      const prompt = buildPromptFromHistory(history, message);

      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "system", content: prompt }, { role: "user", content: message }],
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
      const prompt = buildPromptFromHistory(history, message);

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
    await redis.lpush(key, { role: "user", content: message });
    await redis.lpush(key, { role: "assistant", content: botMessage });
    await redis.ltrim(key, 0, MAX_HISTORY_MESSAGES - 1);
    // optional: set TTL for the conversation
    await redis.expire(key, Number(process.env.SESSION_TTL_SECONDS ?? 86400));

    return NextResponse.json({ message: botMessage });
  } catch (err) {
    console.error("/api/chat error", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
 
