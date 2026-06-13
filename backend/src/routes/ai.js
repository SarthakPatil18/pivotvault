const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const { requireAuth } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Rate limiter for risk scan
const riskScanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many scan requests. Please wait before trying again.', code: 'RATE_LIMITED' }
});

// Risk Scan input schema
const riskScanSchema = z.object({
  idea: z.string().min(10).max(500),
  audience: z.string().min(3).max(200),
  revenueModel: z.string().min(2).max(200),
  teamSize: z.coerce.number().int().min(1).max(100),
  industry: z.string().min(2).max(100),
});

// Simple cache in memory (in production, use Redis)
const scanCache = new Map();

function getCacheKey(input) {
  const str = `${input.idea}|${input.audience}|${input.revenueModel}|${input.teamSize}|${input.industry}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `scan:${hash}`;
}

// AI service for calling Gemini
async function callGemini(prompt) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });
  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(text);
}

async function callGroq(prompt) {
  const Groq = require('groq-sdk');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0].message.content);
}

// type = 'risk' | 'research' | 'playbook' — risk has a legacy mock; the
// others build grounded fallbacks at the route level with DB context.
async function callAI(prompt, type = 'risk') {
  try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
      return await callGemini(prompt);
    }
  } catch (err) {
    console.warn('Gemini failed, trying Groq fallback:', err.message);
  }
  try {
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here') {
      console.log('Using Groq fallback');
      return await callGroq(prompt);
    }
  } catch (err) {
    console.warn('Groq also failed:', err.message);
  }

  // Both AI providers failed.
  if (type === 'research' || type === 'playbook') {
    return null;
  }
  return generateMockAnalysis(prompt);
}

// Fallback for /risk-scan
function generateMockAnalysis(input) {
  const riskScore = Math.floor(Math.random() * 40) + 30;
  return {
    riskScore,
    riskBreakdown: {
      customerAcquisition: Math.floor(Math.random() * 50) + 20,
      retention: Math.floor(Math.random() * 50) + 20,
      monetization: Math.floor(Math.random() * 50) + 20,
      competition: Math.floor(Math.random() * 50) + 20,
      timing: Math.floor(Math.random() * 50) + 20,
    },
    primaryRisk: 'customerAcquisition',
    similarStartups: [
      { name: 'FitAI', similarity: 87, keyLesson: 'Overbuilt features without validating demand first' },
      { name: 'GymGPT', similarity: 72, keyLesson: 'Failed to retain users after initial novelty wore off' },
    ],
    recommendations: [
      { priority: 'high', action: 'Start with a landing page MVP before building full product', rationale: 'Most failures in this space built before validating' },
      { priority: 'high', action: 'Define clear retention metrics from day one', rationale: 'Churn was the primary killer for similar startups' },
      { priority: 'medium', action: 'Consider a freemium model to reduce acquisition friction', rationale: 'Similar startups struggled with paid acquisition costs' },
    ],
  };
}

function prettyCategory(cat) {
  return String(cat || 'unknown').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function findRelevantStartups(query, startups) {
  const normalized = query.toLowerCase();
  const tokens = normalized
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = startups.map((startup) => {
    const haystack = [
      startup.name,
      startup.slug,
      startup.industry,
      startup.status,
      startup.summary,
      ...startup.failureReasons.map((r) => `${r.category} ${r.description}`),
    ].join(' ').toLowerCase();

    let score = 0;
    if (normalized.includes(startup.name.toLowerCase())) score += 10;
    if (normalized.includes(startup.slug.toLowerCase())) score += 10;
    tokens.forEach((token) => {
      if (haystack.includes(token)) score += 1;
    });
    return { startup, score };
  });

  const directMatches = scored.filter((item) => item.score >= 10);
  if (directMatches.length > 0) {
    return directMatches.sort((a, b) => b.score - a.score).map((item) => item.startup);
  }

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.startup);
}

function getPrimaryReason(startup) {
  return startup.failureReasons.find((r) => r.isPrimary) || startup.failureReasons[0] || null;
}

// Grounded fallback for /research when hosted AI providers are unavailable.
function generateMockResearch(query, startups = [], failedCount = 0) {
  const related = findRelevantStartups(query, startups);
  const selected = related.length > 0 ? related : startups.slice(0, 4);
  const missingNames = ['byju', 'byju\'s', 'byjus']
    .some((name) => query.toLowerCase().includes(name)) && !startups.some((s) => s.name.toLowerCase().includes('byju'));

  const comparisonText = selected.length >= 2
    ? `The closest database-backed comparison is ${selected.map((s) => `**${s.name}**`).join(' vs. ')}.`
    : selected.length === 1
      ? `The database has a strong match for **${selected[0].name}**, so this analysis focuses on that case.`
      : 'The database does not contain a strong direct match, so this analysis uses the available failure archive.';

  const caseLines = selected.map((startup) => {
    const primary = getPrimaryReason(startup);
    return `**${startup.name}** (${startup.industry}) failed mainly around **${prettyCategory(primary?.category)}**: ${primary?.description || startup.summary}`;
  });

  return {
    aiSummary: [
      `Analysis for: "${query}". ${comparisonText}`,
      missingNames
        ? 'Important limitation: Byju\'s is not currently present in the PivotVault database, so I will not invent facts about it. Add a Byju\'s record to compare it directly against Quibi.'
        : `This fallback used ${startups.length} local startup records, including ${failedCount} failed-company records, because no hosted AI provider is currently available.`,
      ...caseLines,
    ].join('\n\n'),
    sources: selected.map((s) => s.slug),
    timeline: selected
      .flatMap((startup) => startup.timelineEvents.slice(0, 2).map((event) => ({
        year: new Date(event.eventDate).getFullYear().toString(),
        event: event.title,
        startup: startup.name,
      })))
      .slice(0, 6),
    relatedStartups: selected.map((startup) => ({
      name: startup.name,
      slug: startup.slug,
      industry: startup.industry,
      status: startup.status,
      summary: startup.summary,
    })),
    keyLessons: selected.slice(0, 4).map((startup) => {
      const primary = getPrimaryReason(startup);
      return {
        lesson: `${startup.name}: ${prettyCategory(primary?.category)}`,
        details: primary?.description || startup.summary,
      };
    }),
  };
}

function generateLocalPlaybook(input, similar = []) {
  const primaryReasons = similar.map(getPrimaryReason).filter(Boolean);
  const common = primaryReasons[0];
  const industry = input.industry || 'your market';
  const idea = input.idea || 'your startup idea';

  return {
    title: `Founder Playbook: ${industry}`,
    overview: similar.length > 0
      ? `This playbook is generated from ${similar.length} similar PivotVault cases in ${industry}. The strongest repeated risk is ${prettyCategory(common?.category)}, so validate that before scaling product or spend.`
      : `This playbook is generated without direct industry matches in the local database. It focuses on the most common early startup failure traps: weak demand validation, unclear retention, and scaling before unit economics are proven.`,
    checklist: [
      {
        phase: 'Validate',
        items: [
          `Interview 20 target users about the exact pain behind: ${idea.slice(0, 90)}${idea.length > 90 ? '...' : ''}`,
          'Write one falsifiable demand hypothesis and define the metric that would disprove it.',
          similar.length > 0 ? `Study ${similar[0].name} before choosing positioning or launch timing.` : 'Find at least 3 comparable failures before finalizing the MVP scope.',
        ],
      },
      {
        phase: 'Build',
        items: [
          'Ship the thinnest workflow that proves retention, not the broadest feature set.',
          'Instrument activation, week-one retention, pricing intent, and churn reasons from day one.',
          common ? `Add a specific guardrail for ${prettyCategory(common.category)} risk.` : 'Keep fixed costs low until repeat usage is visible.',
        ],
      },
      {
        phase: 'Scale',
        items: [
          'Increase acquisition spend only after the payback period and retention curve are known.',
          'Run a pre-mortem every month: what would make this fail like the closest archive case?',
          'Keep a shutdown/pivot threshold so sunk cost does not become strategy.',
        ],
      },
    ],
    pitfalls: [
      ...primaryReasons.slice(0, 3).map((reason) => ({
        mistake: prettyCategory(reason.category),
        avoidance: reason.description,
      })),
      {
        mistake: 'Scaling before proof',
        avoidance: 'Do not hire, spend, or expand until a small customer segment repeats the behavior without founder hand-holding.',
      },
    ],
  };
}

// POST /api/ai/risk-scan (auth required)
router.post('/risk-scan', requireAuth, riskScanLimiter, async (req, res, next) => {
  try {
    const input = riskScanSchema.parse(req.body);
    const cacheKey = getCacheKey(input);

    const cached = scanCache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const similarStartups = await prisma.startup.findMany({
      where: {
        OR: [
          { industry: { contains: input.industry, mode: 'insensitive' } },
          { summary: { contains: input.idea.slice(0, 30), mode: 'insensitive' } },
        ],
      },
      include: {
        failureReasons: { take: 3 },
        _count: { select: { timelineEvents: true } },
      },
      take: 10,
    });

    const historicalContext = similarStartups.map(s =>
      `${s.name} (${s.industry}, ${s.status}): ${s.summary?.slice(0, 100)}`
    ).join('\n');

    const prompt = `SYSTEM: You are a startup failure analyst. Analyze this startup idea against historical failures. Return ONLY valid JSON — no prose, no markdown, no explanation.

SCHEMA: {
  "riskScore": 0-100,
  "riskBreakdown": { "customerAcquisition": 0-100, "retention": 0-100, "monetization": 0-100, "competition": 0-100, "timing": 0-100 },
  "primaryRisk": "string",
  "similarStartups": [{ "name": "string", "similarity": 0-100, "keyLesson": "string" }],
  "recommendations": [{ "priority": "high|medium|low", "action": "string", "rationale": "string" }]
}

HISTORICAL CONTEXT:
${historicalContext || 'No directly similar startups found in database.'}

USER STARTUP:
Idea: ${input.idea}
Target Audience: ${input.audience}
Revenue Model: ${input.revenueModel}
Team Size: ${input.teamSize}
Industry: ${input.industry}`;

    const analysis = await callAI(prompt, 'risk');

    const result = {
      ...analysis,
      comparedAgainst: similarStartups.length,
      cached: false,
    };

    scanCache.set(cacheKey, result);
    setTimeout(() => scanCache.delete(cacheKey), 60 * 60 * 1000);

    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', code: 'VALIDATION_ERROR', details: err.errors });
    }
    console.error('Risk scan error:', err);
    res.json({
      ...generateMockAnalysis(req.body),
      comparedAgainst: 0,
      cached: false,
      error: 'AI analysis unavailable, showing estimated scores',
    });
  }
});

// Research assistant schema
const researchSchema = z.object({
  query: z.string().min(3).max(500),
});

// POST /api/ai/research (auth required)
router.post('/research', requireAuth, async (req, res, next) => {
  try {
    const input = researchSchema.parse(req.body);
    const query = input.query;

    // Record search history for the logged-in user (best-effort)
    prisma.searchHistory
      .create({ data: { userId: req.user.id, query: query.slice(0, 500) } })
      .catch((e) => console.warn('Could not record search history:', e.message));

    const startups = await prisma.startup.findMany({
      include: {
        failureReasons: true,
        timelineEvents: true,
      },
      take: 20,
    });

    const failedCount = await prisma.startup.count({
      where: {
        status: 'failed',
      },
    });

    const historicalContext = startups.map(s => `
Name: ${s.name}
Slug: ${s.slug}
Industry: ${s.industry}
Status: ${s.status}
Founded: ${s.foundingYear}
Closed: ${s.shutdownYear ?? 'N/A'}
Summary: ${s.summary}

Reasons:
${s.failureReasons.map(r => r.description).join(', ')}
`).join('\n\n');

    const prompt = `SYSTEM: You are an expert startup failure analyst. Analyze the user's research query using ONLY the historical context of startup failures provided below. You must return ONLY valid JSON matching this schema:
{
  "aiSummary": "A detailed 2-3 paragraph analysis matching the query, detailing the mistakes, comparisons, and structural patterns. Support markdown formatting in the text (like **bolding** and bullets).",
  "sources": ["slug-of-startup-1", "slug-of-startup-2"],
  "timeline": [
    { "year": "YYYY", "event": "Title of event", "startup": "Startup Name" }
  ],
  "relatedStartups": [
    { "name": "Startup Name", "slug": "slug", "industry": "Industry", "status": "failed", "summary": "Short summary" }
  ],
  "keyLessons": [
    { "lesson": "A core lesson", "details": "Elaborate on how to avoid it." }
  ]
}

Rules:
- Use ONLY the supplied database.
- Never invent statistics.
- Never invent startups.
- If information is unavailable, say so clearly in aiSummary.
- Base all answers strictly on the provided records.
- Return ONLY valid JSON.
- Do not wrap JSON in markdown.
- Do not explain outside the JSON object.

DATABASE STATS:
Total startups: ${startups.length}
Failed startups: ${failedCount}

HISTORICAL CONTEXT FROM DATABASE:
${historicalContext || 'No startups found in database.'}

USER QUERY: ${query}`;

    // callAI with type='research' guarantees correct fallback schema
    const aiResult = await callAI(prompt, 'research');
    const result = aiResult || generateMockResearch(query, startups, failedCount);

    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: err.errors,
      });
    }

    if (err.status === 429) {
      return res.status(429).json({
        error: 'AI quota exceeded',
        message: 'Please try again later',
      });
    }

    console.error('Research assistant error:', err);

    return res.status(500).json({
      error: 'Research assistant unavailable',
      details: err.message,
    });
  }
});

// GET /api/ai/history - recent research queries for the logged-in user
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });
    res.json({ history: history.map((h) => ({ id: h.id, query: h.query, createdAt: h.createdAt })) });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Could not load history', code: 'INTERNAL_ERROR' });
  }
});

// Founder Playbook schema
const playbookSchema = z.object({
  idea: z.string().min(10).max(500),
  industry: z.string().min(2).max(100),
  stage: z.string().min(2).max(60).optional(),
});

// POST /api/ai/playbook (auth required) - personalized founder checklist
router.post('/playbook', requireAuth, riskScanLimiter, async (req, res) => {
  try {
    const input = playbookSchema.parse(req.body);

    const similar = await prisma.startup.findMany({
      where: { industry: { contains: input.industry, mode: 'insensitive' } },
      include: { failureReasons: { take: 3 } },
      take: 8,
    });

    const historicalContext = similar
      .map((s) => `${s.name} (${s.status}): ${s.failureReasons.map((r) => r.description).join('; ')}`)
      .join('\n');

    const prompt = `SYSTEM: You are a startup mentor. Based ONLY on the historical failures below, generate a personalized founder playbook for the user's idea. Return ONLY valid JSON, no markdown:
{
  "title": "string",
  "overview": "2-3 sentence summary of the biggest risks for this idea",
  "checklist": [{ "phase": "Validate|Build|Scale", "items": ["actionable item"] }],
  "pitfalls": [{ "mistake": "a common mistake", "avoidance": "how to avoid it" }]
}

HISTORICAL FAILURES:
${historicalContext || 'No similar startups found.'}

USER IDEA: ${input.idea}
INDUSTRY: ${input.industry}
STAGE: ${input.stage || 'idea'}`;

    let playbook;
    try {
      playbook = await callAI(prompt, 'playbook');
      if (!playbook || !playbook.checklist) {
        playbook = generateLocalPlaybook(input, similar);
      }
    } catch {
      playbook = generateLocalPlaybook(input, similar);
    }

    res.json({ ...playbook, comparedAgainst: similar.length });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', code: 'VALIDATION_ERROR', details: err.errors });
    }
    console.error('Playbook error:', err);
    res.json({ ...generateLocalPlaybook(req.body || {}, []), comparedAgainst: 0 });
  }
});

module.exports = router;
