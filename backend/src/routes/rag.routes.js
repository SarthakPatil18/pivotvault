import { Router } from 'express';
import { ragAsk, ragSearch } from '../rag/rag.service.js';
const router = Router();
router.post('/ask', async (req, res, next) => { try { const result = await ragAsk(req.body.query, { contentType: req.body.contentType }); res.json(result); } catch (error) { next(error); } });
router.get('/search', async (req, res, next) => { try { const chunks = await ragSearch(req.query.q, { contentType: req.query.type, limit: req.query.limit ? Number(req.query.limit) : undefined }); res.json({ chunks, total: chunks.length }); } catch (error) { next(error); } });
export default router;
