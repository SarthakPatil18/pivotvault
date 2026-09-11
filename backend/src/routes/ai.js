const { Router } = require('express');
const { callGemini, wrapExternalContent } = require('../agents/lib/ai');
const { scoreIdea } = require('../agents/lib/ideaScoreModel');
const { ragAsk, ragSearch } = require('../rag/rag.service');

const router = Router();
router.post('/risk-scan', async (req, res, next) => {
  try { const chunks = await ragSearch(req.body.query ?? req.body.ideaText, { limit: 5 }); const score = await scoreIdea(req.body.features); res.json({ ideaScore: score.ideaScore, scoreBreakdown: score.breakdown, sources: chunks }); } catch (error) { next(error); }
});
router.post('/ghost-chat', async (req, res, next) => {
  try { const context = await ragAsk(req.body.query, { limit: 5 }); const answer = await callGemini(`Simulate a founder conversation using this evidence context: ${wrapExternalContent(context.answer)}\nUser: ${req.body.message ?? req.body.query}`); if (answer == null) throw new Error('No LLM response available.'); res.json({ answer, sources: context.sources }); } catch (error) { next(error); }
});
router.post('/research', async (req, res, next) => { try { res.json(await ragAsk(req.body.query, { contentType: req.body.contentType })); } catch (error) { next(error); } });
router.post('/playbook', async (req, res, next) => {
  try { const chunks = await ragSearch(req.body.query ?? req.body.ideaText, { limit: 5 }); const evidence = chunks.map((chunk) => wrapExternalContent(chunk.chunkText)).join('\n'); const plan = await callGemini(`Create a personalized 90-day plan from these analogous cases:\n${evidence}\nIdea: ${req.body.ideaText ?? req.body.query}`); if (plan == null) throw new Error('No LLM response available.'); res.json({ plan, sources: chunks }); } catch (error) { next(error); }
});
module.exports = router;
