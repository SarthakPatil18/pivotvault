const { getConfig } = require('./runtime');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getDeterministicMockEmbedding(text) {
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) & 0xffffffff;
  }
  const vec = new Array(768);
  let norm = 0;
  for (let i = 0; i < 768; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    vec[i] = ((seed >>> 0) / 0xffffffff) * 2 - 1;
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm) || 1;
  return vec.map(v => v / norm);
}

async function requestEmbedding(text) {
  const config = await getConfig();
  const apiKey = config.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('mock-')) {
    return getDeterministicMockEmbedding(text);
  }
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
  if (typeof text !== 'string' || !text.trim()) return getDeterministicMockEmbedding('default');
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try { 
      return await requestEmbedding(text); 
    } catch (error) {
      if (attempt < 1) await delay(100);
    }
  }
  return getDeterministicMockEmbedding(text);
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
