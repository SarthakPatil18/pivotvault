const { z } = require('zod');

const AgentInput = z.object({ query: z.string().min(1), ideaText: z.string().min(1), stage: z.string().min(1), market: z.string().min(1), assumptions: z.array(z.string()).default([]) });
const Evidence = z.object({ sourceUrl: z.string().url().optional().or(z.literal('')), content: z.string(), confidence: z.number().min(0).max(1), companyName: z.string().optional().default('') });
const SpecialistFinding = z.object({ agentName: z.string(), findings: z.record(z.string(), z.unknown()), confidence: z.number().min(0).max(1), sources: z.array(z.unknown()).default([]) });
const DecisionDossier = z.object({ ideaScore: z.number().min(0).max(100), verdict: z.enum(['PROCEED', 'CAUTION', 'ABORT']), topRisks: z.array(z.object({ risk: z.string(), evidence: z.string(), severity: z.enum(['low', 'medium', 'high', 'critical']) })), topOpportunities: z.array(z.object({ opportunity: z.string(), evidence: z.string() })), redTeamWarnings: z.array(z.string()), executionPlan: z.object({ day30: z.array(z.string()), day60: z.array(z.string()), day90: z.array(z.string()) }), sources: z.array(z.unknown()) });
module.exports = { AgentInput, Evidence, SpecialistFinding, DecisionDossier };
