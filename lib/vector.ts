export type DocChunk = {
  id: string;
  title: string;
  content: string;
  meta?: Record<string, any>;
};

export type EmbeddedChunk = DocChunk & { embedding: number[] };

export function cosineSim(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1e-8;
  return dot / denom;
}

export function topKBySimilarity(
  queryEmbedding: number[],
  docs: EmbeddedChunk[],
  k: number = 5
): Array<EmbeddedChunk & { score: number }> {
  const scored = docs.map((d) => ({ ...d, score: cosineSim(queryEmbedding, d.embedding) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
