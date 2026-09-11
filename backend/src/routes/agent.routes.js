import { Router } from 'express';
import { getPrisma } from '../rag/runtime.js';
import { runDecision } from '../agents/supervisor.js';
import { AgentInput } from '../agents/lib/types.js';
const router = Router();
router.post('/decision', async (req, res, next) => { try { res.json(await runDecision(AgentInput.parse(req.body))); } catch (error) { next(error); } });
router.get('/telemetry', async (_req, res, next) => { try { const prisma = await getPrisma(); const runs = await prisma.agentExecution.findMany({ orderBy: { startedAt: 'desc' }, take: 100 }); const done = runs.filter((run) => run.status === 'completed'); const durations = done.map((run) => new Date(run.completedAt) - new Date(run.startedAt)); res.json({ runs, avgDuration: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0, successRate: runs.length ? done.length / runs.length : 0 }); } catch (error) { next(error); } });
export default router;
