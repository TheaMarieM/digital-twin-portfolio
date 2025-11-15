import { NextResponse } from "next/server";

type State = {
  latency: number;
  cpu: number;
  mem: number;
  rps: number;
  last: number;
};

function seedState(): State {
  return { latency: 120, cpu: 32, mem: 48, rps: 42, last: Date.now() };
}

const KEY = "__MY_AI_APP_METRICS_STATE_v1" as const;

function randWalk(prev: State): State {
  const now = Date.now();
  const dt = Math.max(1, Math.min(5000, now - prev.last));
  const step = Math.min(1 + dt / 1000, 6);
  const jitter = () => (Math.random() - 0.5) * step * 10;
  const latency = Math.max(30, Math.min(2000, prev.latency + jitter() * 4));
  const cpu = Math.max(2, Math.min(98, prev.cpu + jitter()));
  const mem = Math.max(8, Math.min(98, prev.mem + (Math.random() - 0.5) * 4));
  const rps = Math.max(1, Math.min(5000, prev.rps + (Math.random() - 0.5) * step * 20));
  return { latency, cpu, mem, rps, last: now };
}

export async function GET() {
  try {
    // keep a simple server-side state so values evolve between requests
    const g = global as any;
    if (!g[KEY]) g[KEY] = seedState();
    g[KEY] = randWalk(g[KEY]);

    const res = {
      latency: Math.round(g[KEY].latency),
      cpu: Math.round(g[KEY].cpu),
      mem: Math.round(g[KEY].mem),
      rps: Math.round(g[KEY].rps),
      ts: new Date().toLocaleTimeString(),
    };

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
