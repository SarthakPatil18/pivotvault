const path = require('path');
const dotenv = require('dotenv');

// Load backend/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

function mask(str) {
  if (!str || str.includes('your-') || str.includes('mock')) return 'NOT CONFIGURED / PLACEHOLDER';
  if (str.length <= 8) return '****';
  return str.slice(0, 4) + '...' + str.slice(-4);
}

async function testGroq(key) {
  if (!key || key.includes('your-')) return { status: 'SKIPPED', message: 'Key not set' };
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Say OK' }]
      })
    });
    if (res.ok) {
      const data = await res.json();
      return { status: 'CONNECTED', message: `200 OK — Model response: "${data.choices?.[0]?.message?.content?.trim()}"` };
    }
    const err = await res.text();
    return { status: 'FAILED', message: `HTTP ${res.status}: ${err.slice(0, 120)}` };
  } catch (err) {
    return { status: 'ERROR', message: err.message };
  }
}

async function testGemini(key, model = 'gemini-1.5-flash') {
  if (!key || key.includes('your-')) return { status: 'SKIPPED', message: 'Key not set' };
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });
    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return { status: 'CONNECTED', message: `200 OK — Model response: "${text}"` };
    }
    const err = await res.text();
    return { status: 'FAILED', message: `HTTP ${res.status}: ${err.slice(0, 120)}` };
  } catch (err) {
    return { status: 'ERROR', message: err.message };
  }
}

async function testTavily(key) {
  if (!key || key.includes('your-')) return { status: 'SKIPPED', message: 'Key not set' };
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query: 'startup market',
        max_results: 1
      })
    });
    if (res.ok) {
      const data = await res.json();
      return { status: 'CONNECTED', message: `200 OK — Retrieved ${data.results?.length || 0} search results` };
    }
    const err = await res.text();
    return { status: 'FAILED', message: `HTTP ${res.status}: ${err.slice(0, 120)}` };
  } catch (err) {
    return { status: 'ERROR', message: err.message };
  }
}

async function main() {
  console.log('=== PIVOTVAULT ENVIRONMENT CONFIGURATION VERIFICATION ===\n');

  console.log(`Port: ${process.env.PORT || 5001}`);
  console.log(`Node Env: ${process.env.NODE_ENV || 'development'}`);
  console.log('');

  console.log('Checking Groq (Llama 3)...');
  console.log(`  Key: ${mask(process.env.GROQ_API_KEY)}`);
  const groqRes = await testGroq(process.env.GROQ_API_KEY);
  console.log(`  Status: ${groqRes.status === 'CONNECTED' ? '✅' : '❌'} [${groqRes.status}] ${groqRes.message}\n`);

  console.log('Checking Google Gemini...');
  console.log(`  Key: ${mask(process.env.GEMINI_API_KEY)}`);
  const geminiRes = await testGemini(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL || 'gemini-1.5-flash');
  console.log(`  Status: ${geminiRes.status === 'CONNECTED' ? '✅' : '❌'} [${geminiRes.status}] ${geminiRes.message}\n`);

  console.log('Checking Tavily Search...');
  console.log(`  Key: ${mask(process.env.TAVILY_API_KEY)}`);
  const tavilyRes = await testTavily(process.env.TAVILY_API_KEY);
  console.log(`  Status: ${tavilyRes.status === 'CONNECTED' ? '✅' : '❌'} [${tavilyRes.status}] ${tavilyRes.message}\n`);
}

main().catch(console.error);
