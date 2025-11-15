export async function getEmbedding(input: string): Promise<number[]> {
  // If using a local embedding server (Option B), call it first.
  const useLocal = String(process.env.USE_LOCAL_EMBEDDINGS || '').toLowerCase() === 'true';
  const localUrl = process.env.LOCAL_EMBEDDING_URL || 'http://127.0.0.1:8000';

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  if (useLocal) {
    let lastError: string | null = null;
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`${localUrl.replace(/\/+$/, '')}/embed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
          cache: 'no-store',
        });

        if (res.ok) {
          const json = await res.json();
          // Accept either {embedding: number[]} or {embeddings: [[...]]}
          if (Array.isArray(json?.embedding)) return json.embedding as number[];
          if (Array.isArray(json?.embeddings) && Array.isArray(json.embeddings[0])) return json.embeddings[0] as number[];
          lastError = lastError || 'Local embedding service returned invalid shape';
          console.error('Invalid embedding shape from local server:', JSON.stringify(json));
          break;
        }

        const body = await res.text().catch(() => '(no body)');
        lastError = lastError || `Local embedding server responded ${res.status}: ${body}`;
        console.error('Local embedding server error:', res.status, body);

        if (attempt < maxRetries) {
          const delay = 500 * Math.pow(2, attempt);
          console.warn(`Local embed server error, retrying in ${delay}ms (attempt ${attempt + 1})`);
          await sleep(delay);
          continue;
        }
        break;
      } catch (err: any) {
        lastError = lastError || (err?.message ?? String(err));
        console.error('Local embedding network/error:', err);
        if (attempt < maxRetries) {
          const delay = 500 * Math.pow(2, attempt);
          await sleep(delay);
          continue;
        }
        break;
      }
    }

    console.error('Final local embedding error:', lastError);
    throw new Error(
      `Failed to call local embedding service at ${localUrl}. Ensure the service is running and LOCAL_EMBEDDING_URL is correct. Error: ${lastError}`
    );
  }

  // Fallback: use OpenAI embeddings (original behavior)
  // Ensure the OpenAI key is present
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable. Set OPENAI_API_KEY to generate embeddings or enable USE_LOCAL_EMBEDDINGS.');
  }

  let lastError: string | null = null;
  // Try OpenAI embeddings with a small retry/backoff for transient 429s or network errors
  const maxRetries = 2;
  const baseDelay = 500; // ms
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({ model: 'text-embedding-3-small', input }),
        cache: 'no-store',
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data?.[0]?.embedding && Array.isArray(json.data[0].embedding)) {
          return json.data[0].embedding as number[];
        }
        lastError = lastError || 'OpenAI returned invalid embedding shape';
        console.error('Invalid embedding shape from OpenAI:', JSON.stringify(json));
        break;
      }

      const body = await res.text().catch(() => '(no body)');
      lastError = lastError || `OpenAI embeddings responded ${res.status}: ${body}`;
      console.error('❌ OpenAI Embedding API response:', res.status, body);

      // Retry on rate-limited responses
      if (res.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // 500ms, 1000ms
        console.warn(`OpenAI 429 received, retrying in ${delay}ms (attempt ${attempt + 1})`);
        await sleep(delay);
        continue;
      }

      // For other errors or last retry, stop and surface error
      break;
    } catch (err: any) {
      lastError = lastError || (err?.message ?? String(err));
      console.error('OpenAI embedding network/error:', err);
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      break;
    }
  }

  console.error('Final embedding error:', lastError);

  const isQuota = typeof lastError === 'string' && /quota|insufficient_quota|429/i.test(lastError);
  if (isQuota) {
    throw new Error(
      'Failed to generate embeddings: OpenAI quota exceeded. Check your billing/plan or rotate the OPENAI_API_KEY.'
    );
  }

  throw new Error(`Failed to generate embeddings. Please check OPENAI_API_KEY and server logs for details.${lastError ? ' (see server logs)' : ''}`);
}
