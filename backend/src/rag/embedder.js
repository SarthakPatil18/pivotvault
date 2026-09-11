const { getConfig } = require('./runtime');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestEmbedding(text) {
  const config = await getConfig();
  const apiKey = config.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');
  const model = 'text-embedding-004';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: `models/${model}`, content: { parts: [{ text }] } }),
  });
  if (!response.ok) throw new Error(`Gemini embedding request failed (${response.status}): ${await response.text()}`);
  const payload = await response.json();
  const embedding = payload.embedding?.values;
  if (!Array.isArray(embedding) || embedding.length !== 768) throw new Error('Gemini returned an invalid embedding dimension.');
  return embedding;
}

async function generateEmbedding(text) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('Embedding text must be non-empty.');
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try { return await requestEmbedding(text); } catch (error) {
      lastError = error;
      if (attempt < 2) await delay(200 * (2 ** attempt));
    }
  }
  throw lastError;
}

async function generateEmbeddings(texts) {
  if (!Array.isArray(texts)) throw new Error('texts must be an array.');
  const embeddings = [];
  for (const text of texts) {
    if (embeddings.length) await delay(200);
    embeddings.push(await generateEmbedding(text));
  }
  return embeddings;
}
module.exports = { generateEmbedding, generateEmbeddings };
