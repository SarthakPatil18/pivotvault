You are building the intelligence layer for PivotVault —
an AI startup failure intelligence platform.

YOUR JOB: Build the RAG system and agent architecture.
You are NOT touching scrapers, pipeline workers,
database schema, or frontend. Only AI intelligence.

⚠️ STRICT FILE OWNERSHIP — READ FIRST ⚠️
Your teammate is working simultaneously on the database,
scraper, and pipeline layer. To avoid merge conflicts,
you must ONLY create or modify files inside your owned
paths. Do not touch, rename, or restructure ANY file
outside your scope, even if it seems related or you think
it needs a small fix. If you believe a file outside your
scope needs a change, STOP and flag it instead of editing it.

YOU OWN (create/modify freely):
  backend/src/rag/
  backend/src/agents/
  backend/src/pipeline/embeddingWorker.js
  backend/src/routes/rag.routes.js
  backend/src/routes/agent.routes.js
  backend/src/routes/ai.js   ← modifications only, do not restructure

YOU DO NOT TOUCH (teammate's active files):
  backend/src/scraper/
  backend/src/pipeline/queues.js
  backend/src/pipeline/workers.js (any worker except embeddingWorker.js)
  backend/prisma/schema.prisma
  backend/prisma/seed.js
  frontend/

═══════════════════════════════════════════════════════
CONTEXT — WHAT PIVOTVAULT IS
═══════════════════════════════════════════════════════

PivotVault helps founders learn from startup failures.
The database and pipeline are built by another developer.
Your job is to make the AI actually use that data.

Tech stack:
- PostgreSQL + pgvector on Railway (vector search)
- Prisma ORM
- Google Gemini (text-embedding-004 + gemini-1.5-flash)
- Groq LLaMA 3 70B (fast inference)
- Tavily (live web search)
- Node.js backend
- A prebuilt, already-trained ML model that scores a
  startup idea directly (see IDEA SCORE MODEL section below)

═══════════════════════════════════════════════════════
HANDOFF CONTRACT FROM TEAMMATE
═══════════════════════════════════════════════════════

Your teammate feeds you jobs via BullMQ embeddingQueue.
Each job contains:
{
  contentId: string,
  contentType: string,   // postmortem|news|interview|idea
  text: string,
  metadata: {
    companyName, industry, failureYear, source, slug
  }
}

You read this queue and handle all embedding + indexing.
The Embedding table already exists in the schema with
vector(768) column. pgvector extension is enabled.

Do not add fields to this contract or the schema — if you
need something new from the teammate's side, flag it,
don't add it yourself.

═══════════════════════════════════════════════════════
IDEA SCORE MODEL — REPLACES THE MANUAL FORMULA
═══════════════════════════════════════════════════════

IMPORTANT: There is already a trained ML model that scores
a startup idea directly. It replaces the old hand-rolled
weighted formula (pmf/burn/team/market/competitor) that
would otherwise live in riskAnalyst.js. Do NOT reimplement
scoring logic with an LLM guess or a manual weighted sum —
call the existing model.

lib/ideaScoreModel.js:
  - Export scoreIdea(features) → { ideaScore, breakdown }
  - `features` is whatever structured input your model
    expects (e.g. extracted signals from evidence: market
    saturation, team signals, burn/funding signals, etc.)
    — build this file as a thin wrapper around however the
    model is actually served (local inference call, REST
    endpoint, or a Python microservice). If you don't yet
    know the exact call signature, stub it with a clearly
    marked TODO and a mock return shape so the rest of the
    pipeline can be built against it now:
      { ideaScore: number (0-100), breakdown: {} }
  - Never fall back to an LLM-estimated score if the model
    call fails — surface the failure instead (throw / log),
    since a guessed number would be misleading.

specialists/riskAnalyst.js (renamed responsibility):
  INPUT: { agentInput, evidence, marketFinding, historicalFinding }
  DOES:
    Extracts the feature signals your ideaScoreModel needs
    from evidence + marketFinding + historicalFinding, then
    calls ideaScoreModel.scoreIdea(features).
    Do NOT compute the score manually in this file — the
    model is the source of truth for the score itself.
  OUTPUT: SpecialistFinding with fields:
    { ideaScore, scoreBreakdown{}, topRisks[] }

  Label this "Idea Score" everywhere — in logs, in the
  DecisionDossier, in any user-facing string. Never call it
  "risk score", "survival score", or "survival probability".

specialists/synthesis.js:
  DOES:
    Compiles all findings into final DecisionDossier.
    ideaScore comes from riskAnalyst's model call (not
    recalculated here).
    Verdict logic (unchanged thresholds, renamed field):
      ideaScore >= 70 → PROCEED
      ideaScore 40-69 → CAUTION
      ideaScore < 40  → ABORT
    Generates 90-day plan based on top risks.
  OUTPUT: DecisionDossier (exact Zod schema below)

lib/types.js — DecisionDossier schema (updated):
  DecisionDossier: {
    ideaScore (0-100),          ← renamed from survivalScore
    verdict (PROCEED/CAUTION/ABORT),
    topRisks [{ risk, evidence, severity }],
    topOpportunities [{ opportunity, evidence }],
    redTeamWarnings [],
    executionPlan { day30[], day60[], day90[] },
    sources []
  }

═══════════════════════════════════════════════════════
WHAT YOU ARE BUILDING
═══════════════════════════════════════════════════════

1. RAG SYSTEM — backend/src/rag/

chunker.js:
  - Export chunkText(text, chunkSize=512, overlap=64)
  - Split on word boundaries only
  - Never split mid-sentence if possible
  - Return string array

embedder.js:
  - Export generateEmbedding(text) → float[]
  - Export generateEmbeddings(texts[]) → float[][]
  - Model: text-embedding-004 (768 dimensions)
  - Add 200ms delay between calls (rate limit)
  - Retry 3 times on failure with exponential backoff

indexer.js:
  - Export indexDocument({ contentId, contentType, text, metadata })
  - Delete old embeddings for same contentId+contentType first
  - Chunk → embed → write to Embedding table
  - Use raw Prisma SQL for vector insert:
    INSERT INTO "Embedding" (..., embedding)
    VALUES (..., '[0.1,0.2,...]'::vector)
  - After indexing: update Company.enriched = true
  - Log: chunk count, contentId, contentType

retriever.js:
  - Export retrieve(queryText, options={})
  - Options: { contentType?, limit=10, threshold=0.7 }
  - Embed the query text
  - Run cosine similarity search:
    SELECT *, 1 - (embedding <=> query::vector) as similarity
    FROM "Embedding"
    WHERE similarity > threshold
    ORDER BY similarity DESC
    LIMIT limit
  - Return: [{ chunkText, metadata, similarity, contentId }]

reranker.js:
  - Export rerank(query, chunks[])
  - Takes retrieved chunks, scores them by:
    1. Keyword overlap with query (exact match bonus)
    2. Recency (newer failure = higher weight)
    3. Similarity score from retriever
  - Returns top 5 reranked chunks

rag.service.js:
  - Export ragAsk(query, options={})
  - Full pipeline: retrieve → rerank → build context → LLM
  - Context format passed to LLM:
    "Based on these startup failure case studies:
    [CHUNK 1 - CompanyName, Year]: text...
    [CHUNK 2 - CompanyName, Year]: text...
    Answer this question: {query}"
  - Use Gemini for answer generation
  - Return: { answer, sources[], tokensUsed, chunksUsed }

  - Export ragSearch(query, options={})
  - Returns raw chunks without LLM generation
  - Used by features that need evidence, not prose answers

embeddingWorker.js (reads from BullMQ embeddingQueue):
  - Reads jobs from teammate's knowledgeIndexerQueue
  - Calls indexer.indexDocument() for each job
  - Updates job status in DB
  - On failure: adds to retryQueue with backoff

2. AGENT SYSTEM — backend/src/agents/

lib/ai.js:
  - Export callGemini(prompt, options={})
    options: { maxTokens=1000, json=false, system="" }
  - Export callGroq(prompt, options={})
    options: { maxTokens=1000, model="llama3-70b-8192" }
  - Export wrapExternalContent(text)
    Wraps in: <EXTERNAL_CONTENT>{text}</EXTERNAL_CONTENT>
    Prevents prompt injection from scraped content
  - Export parseJSON(text)
    Strips markdown fences, parses JSON safely
    Returns null on parse failure (never throw)
  - Model failover:
    Try Gemini first → if fails → try Groq → if fails → return null

lib/tools.js:
  - Export tool registry object with these tools:

  searchWeb: calls Tavily API, returns sources[]
  getCompany: queries DB by name/slug, returns Company
  scanRisks: calls riskAnalyst → ideaScoreModel.scoreIdea(), returns ideaScore
  getFiling: queries SEC filings from DB
  getClaims: queries verified Claims from DB for a company
  queryGraph: queries knowledge graph edges from DB
  searchRAG: calls ragSearch() from rag.service.js

  - Export dispatchTool(toolName, params)
    Looks up tool in registry, calls it, returns result
    Wraps all external results with wrapExternalContent()

lib/types.js:
  - Zod schemas for:

  AgentInput: { query, ideaText, stage, market, assumptions[] }
  Evidence: { sourceUrl, content, confidence, companyName }
  SpecialistFinding: { agentName, findings, confidence, sources[] }
  DecisionDossier: (see IDEA SCORE MODEL section above —
    uses ideaScore, not survivalScore)

lib/logger.js:
  - Export log object with methods:
    log.agent(agentName, message, data)
    log.worker(workerName, jobId, status)
    log.rag(operation, chunks, duration)
    log.external(source, query, resultCount)
  - Format: [TIMESTAMP][CATEGORY][NAME] message

specialists/evidenceRetrieval.js:
  INPUT: AgentInput
  DOES:
    1. searchRAG(query) → get relevant DB chunks
    2. searchWeb(query) → get live Tavily results
    3. getClaims(companyName) → get verified claims
    4. Combine, deduplicate, rank by confidence
  OUTPUT: Evidence[] (this is passed to ALL Stage 2 agents)
  RULE: This runs ONCE in Stage 1. Never called again.

specialists/historicalIntel.js:
  INPUT: { agentInput, evidence: Evidence[] }
  DOES:
    Uses provided evidence (NO new fetching)
    Finds similar historical failures from evidence
    Identifies failure pattern matches
    Calculates historical risk signal
  OUTPUT: SpecialistFinding with fields:
    { similarCompanies[], failurePatterns[], historicalRiskSignal }

specialists/marketIntel.js:
  INPUT: { agentInput, evidence: Evidence[] }
  DOES:
    Uses provided evidence (NO new fetching)
    Evaluates market size and saturation from evidence
    Identifies sector trends
    Assesses timing risk
  OUTPUT: SpecialistFinding with fields:
    { marketSize, saturationScore, timingRisk, sectorTrend }

specialists/competitorIntel.js:
  INPUT: { agentInput, evidence: Evidence[] }
  DOES:
    Uses provided evidence (NO new fetching)
    Identifies incumbents and their moats
    Assesses pricing power and switching costs
    Finds alternative solutions
  OUTPUT: SpecialistFinding with fields:
    { incumbents[], moatStrength, alternativeSolutions[] }

specialists/riskAnalyst.js:
  See IDEA SCORE MODEL section above — calls the prebuilt
  ML model instead of computing a manual weighted formula.

specialists/decisionCritic.js:
  INPUT: {
    founderClaims: string[],     ← from agentInput.assumptions
    specialistFindings: {
      market: SpecialistFinding,
      competitor: SpecialistFinding,
      risk: SpecialistFinding,
      historical: SpecialistFinding
    },
    evidence: Evidence[]
  }
  DOES:
    Adversarially attacks every founder assumption
    Identifies what specialists were too optimistic about
    Highlights evidence that contradicts the findings
    Must produce at least 3 concrete warnings
  OUTPUT: { warnings[], attackedAssumptions[], blindspots[] }

specialists/synthesis.js:
  See IDEA SCORE MODEL section above.

supervisor.js:
  CRITICAL RULES:
  - Stage 1 evidence is fetched ONCE and passed down
  - Stage 2 runs with Promise.allSettled + 15s timeout each
  - Stage 3 receives ALL Stage 2 outputs
  - If a specialist times out → mark as { status: 'timeout', findings: null }
  - Synthesis still runs even with partial Stage 2 results
  - Every run logged to AgentExecution table

  EXACT FLOW:
  async runDecision(agentInput) {
    const run = await createAgentExecution(agentInput);

    // Stage 1
    const evidence = await evidenceRetrieval.run(agentInput);

    // Stage 2 — parallel, with timeout
    const [market, competitor, risk, historical] =
      await Promise.allSettled([
        withTimeout(marketIntel.run({ agentInput, evidence }), 15000),
        withTimeout(competitorIntel.run({ agentInput, evidence }), 15000),
        withTimeout(riskAnalyst.run({ agentInput, evidence }), 15000),
        withTimeout(historicalIntel.run({ agentInput, evidence }), 15000),
      ]);

    // Stage 3
    const critique = await decisionCritic.run({
      founderClaims: agentInput.assumptions,
      specialistFindings: { market, competitor, risk, historical },
      evidence,
    });

    // Stage 4
    const dossier = await synthesis.run({
      agentInput, evidence,
      specialistFindings: { market, competitor, risk, historical },
      critique,
    });

    await updateAgentExecution(run.id, dossier);
    return dossier;
  }

3. API ROUTES — backend/src/routes/

These are the ONLY routes you build.
Every route calls a service or agent. Zero logic in routes.

rag.routes.js:
  POST /api/rag/ask
    body: { query, contentType? }
    calls: ragService.ragAsk()
    returns: { answer, sources[], tokensUsed }

  GET /api/rag/search
    query: ?q=...&type=...&limit=...
    calls: ragService.ragSearch()
    returns: { chunks[], total }

agent.routes.js:
  POST /api/agent/decision
    body: AgentInput (validated with Zod)
    calls: supervisor.runDecision()
    returns: DecisionDossier (with ideaScore field)

  GET /api/agent/telemetry
    calls: DB query on AgentExecution
    returns: { runs[], avgDuration, successRate }

ai.routes.js (modify existing, add RAG to these endpoints):
  POST /api/ai/risk-scan
    NOW uses ragService.ragSearch() for context
    before calling riskAnalyst (ideaScoreModel)
    — response field is ideaScore, not riskScore

  POST /api/ai/ghost-chat
    NOW uses ragService.ragAsk() for persona context
    before generating founder simulation

  POST /api/ai/research
    NOW uses ragService.ragAsk() instead of raw Gemini call

  POST /api/ai/playbook
    NOW uses ragService.ragSearch() for similar playbooks
    before generating personalized plan

═══════════════════════════════════════════════════════
RULES — FOLLOW EXACTLY
═══════════════════════════════════════════════════════

DO:
- Use Zod to validate all agent inputs and outputs
- Wrap ALL external content with wrapExternalContent()
  before passing to any LLM prompt
- Add 15 second timeout to every specialist agent
- Use Promise.allSettled (never Promise.all) for parallel agents
- Log every agent run to AgentExecution table
- Try Gemini first, fall back to Groq on failure
- Return null from parseJSON on failure, never throw
- Use ragSearch() inside agents, never direct Tavily calls
  (evidence retrieval agent is the only one that calls Tavily)
- Call the prebuilt ideaScoreModel for the idea score —
  never approximate it with an LLM or manual formula
- Stay strictly inside your owned file paths (see top of
  this prompt) — if a change outside your scope seems
  necessary, stop and flag it instead of making it

DO NOT:
- Write any scraper code
- Write any pipeline worker code (except embeddingWorker)
- Write any database schema changes
- Call Tavily directly from specialist agents
  (only evidenceRetrieval agent can call Tavily)
- Re-fetch evidence in Stage 2 agents
  (evidence comes from Stage 1, passed as parameter)
- Calculate the idea score in frontend
- Generate a score number without going through
  ideaScoreModel.scoreIdea()
- Use the terms "risk score" / "survival score" anywhere —
  it's "Idea Score"
- Write any frontend code
- Touch, rename, or restructure any file outside your
  owned paths, even to "fix" something

HANDOFF CONTRACT TO TEAMMATE:
You write to Company.enriched = true after indexing.
Teammate's pipeline checks enriched flag to know
what has been processed.

You read from embeddingQueue.
Teammate writes to embeddingQueue via knowledgeIndexerWorker.

Do not change the shape of this contract without flagging
it to your teammate first — they're actively building
against the current shape simultaneously.

═══════════════════════════════════════════════════════
START HERE — BUILD IN THIS ORDER
═══════════════════════════════════════════════════════

1. rag/chunker.js
2. rag/embedder.js
3. rag/indexer.js
4. rag/retriever.js
5. rag/reranker.js
6. rag/rag.service.js
7. agents/lib/ai.js
8. agents/lib/ideaScoreModel.js
9. agents/lib/tools.js
10. agents/lib/types.js
11. agents/lib/logger.js
12. agents/specialists/ (all 7 files)
13. agents/supervisor.js
14. routes/rag.routes.js
15. routes/agent.routes.js
16. Modify existing ai.routes.js to use RAG
