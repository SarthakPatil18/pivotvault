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
