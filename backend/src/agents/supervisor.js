import { getPrisma } from '../rag/runtime.js';
import { log } from './lib/logger.js';
import { AgentInput } from './lib/types.js';
import * as competitorIntel from './specialists/competitorIntel.js';
import * as decisionCritic from './specialists/decisionCritic.js';
import * as evidenceRetrieval from './specialists/evidenceRetrieval.js';
import * as historicalIntel from './specialists/historicalIntel.js';
import * as marketIntel from './specialists/marketIntel.js';
import * as riskAnalyst from './specialists/riskAnalyst.js';
import * as synthesis from './specialists/synthesis.js';

const withTimeout = (promise, ms) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('Specialist timed out')), ms))]);
const settled = (result) => result.status === 'fulfilled' ? result.value : { status: result.reason?.message === 'Specialist timed out' ? 'timeout' : 'failed', findings: null };
async function createRun(input) { const prisma = await getPrisma(); return prisma.agentExecution.create({ data: { input, status: 'running', startedAt: new Date() } }); }
async function finishRun(id, dossier) { const prisma = await getPrisma(); return prisma.agentExecution.update({ where: { id }, data: { status: 'completed', result: dossier, completedAt: new Date() } }); }

export async function runDecision(input) {
  const agentInput = AgentInput.parse(input); const run = await createRun(agentInput); const started = Date.now();
  try {
    const evidence = await evidenceRetrieval.run(agentInput);
    const [marketResult, competitorResult, riskResult, historicalResult] = await Promise.allSettled([
      withTimeout(marketIntel.run({ agentInput, evidence }), 15000), withTimeout(competitorIntel.run({ agentInput, evidence }), 15000),
      withTimeout(riskAnalyst.run({ agentInput, evidence }), 15000), withTimeout(historicalIntel.run({ agentInput, evidence }), 15000),
    ]);
    const specialistFindings = { market: settled(marketResult), competitor: settled(competitorResult), risk: settled(riskResult), historical: settled(historicalResult) };
    const critique = await decisionCritic.run({ founderClaims: agentInput.assumptions, specialistFindings, evidence });
    const dossier = await synthesis.run({ agentInput, evidence, specialistFindings, critique });
    await finishRun(run.id, dossier); log.agent('supervisor', 'decision completed', { runId: run.id, durationMs: Date.now() - started }); return dossier;
  } catch (error) {
    const prisma = await getPrisma(); await prisma.agentExecution.update({ where: { id: run.id }, data: { status: 'failed', error: error.message, completedAt: new Date() } }); throw error;
  }
}
