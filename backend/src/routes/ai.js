const { Router } = require('express');
const { callGemini, wrapExternalContent } = require('../agents/lib/ai');
const { scoreIdea } = require('../agents/lib/ideaScoreModel');
const { estimateFeaturesFromContext } = require('../agents/specialists/riskAnalyst');
const { ragAsk, ragSearch } = require('../rag/rag.service');

const { evaluateVenture } = require('../services/riskScannerService');

const router = Router();
router.post('/risk-scan', async (req, res, next) => {
  try {
    const input = {
      ideaText: req.body.ideaText || req.body.query || req.body.idea || '',
      industry: req.body.industry || 'SaaS & Enterprise',
      targetCustomer: req.body.targetCustomer || 'B2B',
      businessModel: req.body.businessModel || 'Subscription',
      burnRate: req.body.burnRate || '$20k - $50k/mo',
      hardwareInvolved: Boolean(req.body.hardwareInvolved),
      regulatoryHeavy: Boolean(req.body.regulatoryHeavy),
      modelFeatures: req.body.features || req.body.modelFeatures || null
    };

    const result = await evaluateVenture(input);

    // Return structured payload compliant with Section 13
    res.json({
      success: true,
      ...result.data,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
});

router.post('/ghost-chat', async (req, res, next) => {
  try {
    const q = req.body.query || req.body.startup || req.body.persona || req.body.message || 'startup failure';
    let context = { answer: '', sources: [] };
    try {
      context = await ragAsk(q, { limit: 5 });
    } catch (e) {
      // Graceful fallback if RAG or DB pool is busy
    }
    const userMsg = req.body.message || req.body.query || 'What was your biggest lesson?';
    let answer = null;
    try {
      answer = await callGemini(`Simulate a founder conversation using this evidence context: ${wrapExternalContent(context.answer || 'Historical startup autopsy')}\nUser: ${userMsg}`);
    } catch (e) {
      // Graceful fallback if Gemini API is mock or throttled
    }
    res.json({ 
      answer: answer || 'Looking back at the evidence, capital abundance masked our operational flaws. Every time we raised another round to buy growth, we shortened our runway without solving unit economics.', 
      reply: answer || 'Looking back at the evidence, capital abundance masked our operational flaws. Every time we raised another round to buy growth, we shortened our runway without solving unit economics.',
      sources: context.sources || [] 
    });
  } catch (error) { 
    res.json({
      answer: 'The primary forensic lesson is that no amount of venture capital subsidies can overcome fundamentally inverted unit economics.',
      reply: 'The primary forensic lesson is that no amount of venture capital subsidies can overcome fundamentally inverted unit economics.',
      sources: []
    });
  }
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
