const { getConfig } = require('../../rag/runtime');

const wrapExternalContent = (text) => `<EXTERNAL_CONTENT>${String(text ?? '')}</EXTERNAL_CONTENT>`;
function parseJSON(text) {
  try {
    const cleaned = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    return JSON.parse(cleaned);
  } catch { return null; }
}

async function gemini(prompt, { maxTokens = 1000, json = false, system = '' } = {}) {
  const config = await getConfig();
  if (!config.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured.');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL ?? 'gemini-1.5-flash'}:generateContent?key=${config.GEMINI_API_KEY}`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ systemInstruction: system ? { parts: [{ text: system }] } : undefined, contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: maxTokens, responseMimeType: json ? 'application/json' : 'text/plain' } }),
  });
  if (!response.ok) throw new Error(`Gemini request failed (${response.status}): ${await response.text()}`);
  const payload = await response.json();
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? null;
}

async function callGroq(prompt, { maxTokens = 1000, model = 'llama3-70b-8192' } = {}) {
  const config = await getConfig();
  if (!config.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured.');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${config.GROQ_API_KEY}` }, body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }) });
  if (!response.ok) throw new Error(`Groq request failed (${response.status}): ${await response.text()}`);
  return (await response.json()).choices?.[0]?.message?.content ?? null;
}

async function callGemini(prompt, options = {}) {
  try { return await gemini(prompt, options); } catch (geminiError) {
    try { return await callGroq(prompt, options); } catch (groqError) {
      console.warn('Both configured LLMs failed.', { geminiError: geminiError.message, groqError: groqError.message });
      return null;
    }
  }
}
module.exports = { callGemini, callGroq, wrapExternalContent, parseJSON };
