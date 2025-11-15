import { NextResponse } from "next/server";

type Req = { vusers?: number; durationSeconds?: number };

function simulateLoad(vusers: number, durationSeconds: number) {
  // create synthetic results that look like a basic load test summary
  const totalRequests = Math.round(vusers * durationSeconds * (0.8 + Math.random() * 0.8));
  const errors = Math.round(totalRequests * (Math.random() < 0.03 ? 0.02 : 0.001));
  const rps = Math.round(totalRequests / Math.max(1, durationSeconds));
  const latencyP50 = Math.round(80 + Math.random() * 120 - vusers * 0.02);
  const latencyP95 = Math.round(latencyP50 * (1.8 + Math.random() * 1.2));
  const latencyP99 = Math.round(latencyP95 * (1.4 + Math.random() * 1.6));

  return {
    summary: {
      vusers,
      durationSeconds,
      totalRequests,
      rps,
      errors,
      successRate: Math.round(((totalRequests - errors) / Math.max(1, totalRequests)) * 10000) / 100,
    },
    latencies: {
      p50: latencyP50,
      p95: latencyP95,
      p99: latencyP99,
    },
    statusCodes: {
      200: Math.max(0, totalRequests - errors),
      500: errors,
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const body: Req = await request.json().catch(() => ({} as Req));
    const vusers = Math.max(1, Math.min(2000, body.vusers ?? 50));
    const durationSeconds = Math.max(1, Math.min(3600, body.durationSeconds ?? 30));

    // simulate some async work (short sleep) to mimic test run
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const result = simulateLoad(vusers, durationSeconds);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
