import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  return NextResponse.json({
    success: !!key,
    // only expose a short prefix for verification, never the full key
    keyPrefix: key ? key.slice(0, 5) : "none",
  });
}
