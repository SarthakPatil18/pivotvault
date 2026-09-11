const { Router } = require('express');
const { callGemini, wrapExternalContent } = require('../agents/lib/ai');
const { scoreIdea } = require('../agents/lib/ideaScoreModel');
const { estimateFeaturesFromContext } = require('../agents/specialists/riskAnalyst');
const { ragAsk, ragSearch } = require('../rag/rag.service');

const router = Router();
router.post('/risk-scan', async (req, res, next) => {
  try {
    const q = req.body.query ?? req.body.ideaText ?? 'Startup Idea';
    let chunks = [];
    try {
      chunks = await ragSearch(q, { limit: 5 });
    } catch {
      chunks = [];
    }

    let features = req.body.features;
    if (!features || Object.keys(features).length === 0 || !Number.isFinite(features.funding_rounds)) {
      features = await estimateFeaturesFromContext({
        ideaText: q,
        industry: req.body.industry,
        targetCustomer: req.body.targetCustomer,
        businessModel: req.body.businessModel,
        burnRate: req.body.burnRate
      });
    }

    const score = await scoreIdea(features);
    res.json({
      ideaScore: score.ideaScore,
      scoreBreakdown: score.breakdown,
      estimatedFeatures: features,
      sources: chunks
    });
  } catch (error) { next(error); }
});

router.post('/ghost-chat', async (req, res, next) => {
  try {
    const q = req.body.query || req.body.startup || req.body.persona || req.body.message || 'startup failure';
    const context = await ragAsk(q, { limit: 5 });
    const userMsg = req.body.message || req.body.query || 'What was your biggest lesson?';
    const answer = await callGemini(`Simulate a founder conversation using this evidence context: ${wrapExternalContent(context.answer)}\nUser: ${userMsg}`);
    res.json({ answer: answer || 'Every time we raised another round, we masked the core problem rather than fixing unit economics.', sources: context.sources || [] });
  } catch (error) { next(error); }
});

router.post('/research', async (req, res, next) => {
  try {
    const q = req.body.query || req.body.question || 'startup failure patterns';
    res.json(await ragAsk(q, { contentType: req.body.contentType }));
  } catch (error) { next(error); }
});

router.post('/playbook', async (req, res, next) => {
  try {
    const q = req.body.query ?? req.body.ideaText ?? 'B2B SaaS';
    const chunks = await ragSearch(q, { limit: 5 });
    const evidence = chunks.map((chunk) => wrapExternalContent(chunk.chunkText)).join('\n');
    const plan = await callGemini(`Create a personalized 90-day plan from these analogous cases:\n${evidence}\nIdea: ${q}`);
    res.json({ plan, sources: chunks });
  } catch (error) { next(error); }
});
module.exports = router;
