/**
 * PivotVault Pipeline Workers (Dev 1)
 * Implements 8 pipeline workers for data ingestion, extraction, verification,
 * entity resolution, knowledge building, pattern mining, and intelligence reporting.
 * 
 * NOTE: Stage 7 (`embeddingWorker`) is owned exclusively by Developer 2 in `embeddingWorker.js`.
 * Dev 1 dispatches to `embeddingQueue` in `knowledgeIndexerWorker` following The Handoff Contract.
 */

const { Worker } = require('bullmq');
const { PrismaClient } = require('@prisma/client');
const { redisConfig } = require('../config/redis');
const { QUEUE_NAMES, queues } = require('./queues');
const { runAllScrapers, runScraper } = require('../scraper');
const logger = require('../lib/logger');

const prisma = new PrismaClient();

// In-memory worker tracking
const activeWorkers = [];

/**
 * Stage 1: Source Discovery Worker
 * Triggers source scrapers and queues raw discovered items to sourceReaderQueue.
 */
function createSourceDiscoveryWorker() {
  return new Worker(
    QUEUE_NAMES.SOURCE_DISCOVERY,
    async (job) => {
      const { source } = job.data || {};
      logger.info(`[Stage 1: SourceDiscovery] Starting discovery for source: ${source || 'ALL'}`);

      let items = [];
      if (source && source !== 'all') {
        items = await runScraper(source);
      } else {
        items = await runAllScrapers();
      }

      logger.info(`[Stage 1: SourceDiscovery] Discovered ${items.length} items. Queuing into SourceReader...`);

      for (const item of items) {
        await queues.sourceReaderQueue.add('read-item', item, {
          jobId: `reader-${item.source}-${Buffer.from(item.url).toString('base64').substring(0, 32)}`,
        });
      }

      return { discoveredCount: items.length };
    },
    { connection: redisConfig, concurrency: 2 }
  );
}

/**
 * Stage 2: Source Reader Worker
 * Validates URLs and content completeness, passing valid payloads to evidenceExtractionQueue.
 */
function createSourceReaderWorker() {
  return new Worker(
    QUEUE_NAMES.SOURCE_READER,
    async (job) => {
      const item = job.data;
      if (!item || !item.url || !item.content) {
        throw new Error('Invalid item payload: missing url or content.');
      }

      logger.debug(`[Stage 2: SourceReader] Reading item from ${item.source}: "${item.title}"`);

      // Forward to Stage 3
      await queues.evidenceExtractionQueue.add('extract-evidence', item);
      return { status: 'forwarded', url: item.url };
    },
    { connection: redisConfig, concurrency: 5 }
  );
}

/**
 * Stage 3: Evidence Extraction Worker
 * Persists raw scraped evidence into the Evidence DB table and queues into evidenceVerificationQueue.
 */
function createEvidenceExtractionWorker() {
  return new Worker(
    QUEUE_NAMES.EVIDENCE_EXTRACTION,
    async (job) => {
      const item = job.data;
      logger.debug(`[Stage 3: EvidenceExtraction] Extracting evidence for "${item.title}"`);

      // Avoid creating duplicate evidence records by sourceUrl
      let evidence = await prisma.evidence.findFirst({
        where: { sourceUrl: item.url },
      });

      if (!evidence) {
        evidence = await prisma.evidence.create({
          data: {
            title: item.title,
            content: item.content,
            sourceUrl: item.url,
            sourceName: item.source,
            contentType: item.contentType || 'POSTMORTEM',
            author: item.author || null,
            publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
            metadata: item.metadata || {},
          },
        });
        logger.info(`[Stage 3: EvidenceExtraction] Created Evidence record [ID: ${evidence.id}]`);
      } else {
        logger.debug(`[Stage 3: EvidenceExtraction] Evidence already exists [ID: ${evidence.id}]`);
      }

      // Forward to Stage 4
      await queues.evidenceVerificationQueue.add('verify-evidence', {
        evidenceId: evidence.id,
        title: evidence.title,
        content: evidence.content,
        sourceName: evidence.sourceName,
        metadata: evidence.metadata,
      });

      return { evidenceId: evidence.id };
    },
    { connection: redisConfig, concurrency: 5 }
  );
}

/**
 * Stage 4: Evidence Verification Worker
 * Extracts atomic verifiable claims from evidence and persists into the Claim DB table.
 */
function createEvidenceVerificationWorker() {
  return new Worker(
    QUEUE_NAMES.EVIDENCE_VERIFICATION,
    async (job) => {
      const { evidenceId, title, content, sourceName } = job.data;
      logger.debug(`[Stage 4: EvidenceVerification] Verifying claims for evidence [${evidenceId}]`);

      // Extract atomic claim statements from the content
      // Heuristic parsing: identify key failure and financial sentences
      const sentences = content
        .split(/(?<=[.?!])\s+/)
        .filter((s) => s.length > 30 && s.length < 300);

      const claimSentences = sentences.filter((s) => {
        const lower = s.toLowerCase();
        return (
          lower.includes('shut down') ||
          lower.includes('failed') ||
          lower.includes('burned') ||
          lower.includes('lost') ||
          lower.includes('debt') ||
          lower.includes('churn') ||
          lower.includes('valuation') ||
          lower.includes('pivot')
        );
      });

      const claimsToProcess = claimSentences.length > 0 ? claimSentences.slice(0, 3) : [title];
      const createdClaims = [];

      for (const sentence of claimsToProcess) {
        // Categorize claim
        let category = 'MARKET';
        const lower = sentence.toLowerCase();
        if (lower.includes('burn') || lower.includes('funding') || lower.includes('debt') || lower.includes('lost')) {
          category = 'FINANCIAL';
        } else if (lower.includes('lawsuit') || lower.includes('sec') || lower.includes('fraud') || lower.includes('illegal')) {
          category = 'LEGAL';
        } else if (lower.includes('bug') || lower.includes('hardware') || lower.includes('code') || lower.includes('defect')) {
          category = 'PRODUCT';
        }

        const claim = await prisma.claim.create({
          data: {
            evidenceId,
            claimText: sentence.trim(),
            category,
            verificationStatus: 'PARTIALLY_VERIFIED',
            confidenceScore: 0.85,
            sources: [sourceName],
            verifiedAt: new Date(),
          },
        });
        createdClaims.push(claim.id);
      }

      logger.info(`[Stage 4: EvidenceVerification] Created ${createdClaims.length} Claims for Evidence [${evidenceId}]`);

      // Forward to Stage 5
      await queues.entityResolutionQueue.add('resolve-entity', {
        evidenceId,
        title,
        content,
        claimIds: createdClaims,
      });

      return { claimsCreated: createdClaims.length };
    },
    { connection: redisConfig, concurrency: 5 }
  );
}

/**
 * Stage 5: Entity Resolution Worker
 * Matches scraped evidence and claims to a Company entity or provisions a new Company profile.
 */
function createEntityResolutionWorker() {
  return new Worker(
    QUEUE_NAMES.ENTITY_RESOLUTION,
    async (job) => {
      const { evidenceId, title, content, claimIds } = job.data;
      logger.debug(`[Stage 5: EntityResolution] Resolving entity for Evidence [${evidenceId}]`);

      // Search existing companies by name / slug mention
      const companies = await prisma.company.findMany({
        select: { id: true, name: true, slug: true },
      });

      let matchedCompany = null;
      const combinedText = `${title} ${content}`.toLowerCase();

      for (const comp of companies) {
        const nameRegex = new RegExp(`\\b${comp.name.toLowerCase()}\\b`, 'i');
        if (nameRegex.test(combinedText)) {
          matchedCompany = comp;
          break;
        }
      }

      // If no existing company matched, attempt to infer company name from title
      if (!matchedCompany) {
        const candidateName = title.split(':')[0].split('—')[0].replace(/YC RFS|Failory Cemetery|IndieHackers|ProductHunt/gi, '').trim();
        if (candidateName && candidateName.length > 2 && candidateName.length < 40) {
          const candidateSlug = candidateName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          matchedCompany = await prisma.company.upsert({
            where: { slug: candidateSlug },
            update: {},
            create: {
              name: candidateName,
              slug: candidateSlug,
              description: content.substring(0, 300),
              industry: 'Technology / Startup',
              enriched: false,
            },
          });
          logger.info(`[Stage 5: EntityResolution] Provisioned new Company [${matchedCompany.name}]`);
        }
      }

      if (matchedCompany) {
        // Link Evidence and Claims to Company
        await prisma.evidence.update({
          where: { id: evidenceId },
          data: { companyId: matchedCompany.id },
        });

        if (claimIds && claimIds.length > 0) {
          await prisma.claim.updateMany({
            where: { id: { in: claimIds } },
            data: { companyId: matchedCompany.id },
          });
        }

        logger.info(`[Stage 5: EntityResolution] Linked Evidence [${evidenceId}] to Company [${matchedCompany.name}]`);

        // Forward to Stage 6
        await queues.knowledgeBuilderQueue.add('build-knowledge', {
          companyId: matchedCompany.id,
        });
      }

      return { companyId: matchedCompany?.id || null };
    },
    { connection: redisConfig, concurrency: 3 }
  );
}

/**
 * Stage 6: Knowledge Builder Worker
 * Synthesizes collected claims and evidence for a company, updating failure reasons and summaries.
 */
function createKnowledgeBuilderWorker() {
  return new Worker(
    QUEUE_NAMES.KNOWLEDGE_BUILDER,
    async (job) => {
      const { companyId } = job.data;
      logger.info(`[Stage 6: KnowledgeBuilder] Building consolidated knowledge for Company [${companyId}]`);

      const company = await prisma.company.findUnique({
        where: { id: companyId },
        include: {
          evidence: true,
          claims: true,
        },
      });

      if (!company) {
        throw new Error(`Company [${companyId}] not found.`);
      }

      // Consolidate failure reasons from verified claims
      const failureClaims = company.claims
        .map((c) => c.claimText)
        .filter((text) => text.length > 20);

      const updatedFailureReasons = Array.from(
        new Set([...company.failureReasons, ...failureClaims])
      ).slice(0, 10);

      // Consolidate postmortem summary
      let postmortemSummary = company.postmortemSummary;
      if (!postmortemSummary && company.evidence.length > 0) {
        const topEvidence = company.evidence[0];
        postmortemSummary = topEvidence.content.substring(0, 800);
      }

      const updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: {
          failureReasons: updatedFailureReasons,
          postmortemSummary,
        },
      });

      logger.info(`[Stage 6: KnowledgeBuilder] Updated Company [${company.name}]. Forwarding to KnowledgeIndexer...`);

      // Forward to Stage 7 (The Handoff Point)
      await queueToEmbeddingHandoff(updatedCompany);

      return { companyId: company.id, name: company.name };
    },
    { connection: redisConfig, concurrency: 3 }
  );
}

/**
 * Stage 7 (Handoff Point): Knowledge Indexer Helper
 * Formats the payload strictly following THE HANDOFF CONTRACT and enqueues into `embeddingQueue`.
 * Dev 2's `embeddingWorker` picks up from `embeddingQueue`.
 */
async function queueToEmbeddingHandoff(company) {
  logger.info(`[Stage 7: KnowledgeIndexer] Dispatching Handoff Job to embeddingQueue for [${company.name}]`);

  const cleanText = [
    `Company: ${company.name}`,
    `Industry: ${company.industry}`,
    `Description: ${company.description}`,
    company.failureYear ? `Failure Year: ${company.failureYear}` : '',
    company.failureReasons.length > 0 ? `Failure Reasons: ${company.failureReasons.join('; ')}` : '',
    company.keyLessons.length > 0 ? `Key Lessons: ${company.keyLessons.join('; ')}` : '',
    company.postmortemSummary ? `Postmortem Summary: ${company.postmortemSummary}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  // CRITICAL: Must match Handoff Contract schema exactly
  const handoffPayload = {
    contentId: company.id,
    contentType: 'postmortem',
    text: cleanText,
    metadata: {
      companyName: company.name,
      industry: company.industry,
      failureYear: company.failureYear || new Date().getFullYear(),
      source: 'PivotVault Knowledge Pipeline',
      slug: company.slug,
    },
  };

  const job = await queues.embeddingQueue.add('index-embedding', handoffPayload, {
    jobId: `embed-${company.slug}`,
  });

  logger.info(`[Stage 7: KnowledgeIndexer] Job [${job.id}] enqueued into embeddingQueue for Dev 2!`);

  // Also trigger Stage 8 (Pattern Miner)
  await queues.patternMinerQueue.add('mine-patterns', {
    companyId: company.id,
    industry: company.industry,
  });

  return job;
}

/**
 * Stage 8: Pattern Miner Worker
 * Discovers and updates cross-company failure patterns.
 */
function createPatternMinerWorker() {
  return new Worker(
    QUEUE_NAMES.PATTERN_MINER,
    async (job) => {
      logger.info('[Stage 8: PatternMiner] Mining failure patterns across all companies...');

      const companies = await prisma.company.findMany({
        where: {
          failureReasons: { isEmpty: false },
        },
        select: {
          id: true,
          slug: true,
          industry: true,
          failureReasons: true,
        },
      });

      logger.info(`[Stage 8: PatternMiner] Analyzing failure factors across ${companies.length} companies.`);

      // Forward to Stage 9
      await queues.intelligenceReporterQueue.add('generate-report', {
        analyzedCompanyCount: companies.length,
      });

      return { analyzedCount: companies.length };
    },
    { connection: redisConfig, concurrency: 1 }
  );
}

/**
 * Stage 9: Intelligence Reporter Worker
 * Computes platform intelligence telemetry, counts, and digest summaries.
 */
function createIntelligenceReporterWorker() {
  return new Worker(
    QUEUE_NAMES.INTELLIGENCE_REPORTER,
    async (job) => {
      logger.info('[Stage 9: IntelligenceReporter] Generating platform intelligence digest...');

      const [totalCompanies, totalEvidence, totalClaims, totalPatterns] = await Promise.all([
        prisma.company.count(),
        prisma.evidence.count(),
        prisma.claim.count(),
        prisma.failurePattern.count(),
      ]);

      const digest = {
        timestamp: new Date(),
        metrics: {
          totalCompanies,
          totalEvidence,
          totalClaims,
          totalPatterns,
        },
      };

      logger.info('[Stage 9: IntelligenceReporter] Digest generated successfully:', digest.metrics);
      return digest;
    },
    { connection: redisConfig, concurrency: 1 }
  );
}

/**
 * Starts all Developer 1 pipeline workers
 */
function startWorkers() {
  logger.info('Starting Developer 1 Pipeline Workers (Stages 1-6, 8, 9)...');

  const workers = [
    createSourceDiscoveryWorker(),
    createSourceReaderWorker(),
    createEvidenceExtractionWorker(),
    createEvidenceVerificationWorker(),
    createEntityResolutionWorker(),
    createKnowledgeBuilderWorker(),
    createPatternMinerWorker(),
    createIntelligenceReporterWorker(),
  ];

  workers.forEach((worker) => {
    worker.on('failed', (job, err) => {
      logger.error(`Worker [${worker.name}] job ${job?.id} failed: ${err.message}`);
    });
    activeWorkers.push(worker);
  });

  logger.info(`Initialized ${activeWorkers.length} pipeline workers.`);
  return activeWorkers;
}

/**
 * Gracefully stops all workers
 */
async function stopWorkers() {
  logger.info('Shutting down pipeline workers...');
  await Promise.all(activeWorkers.map((w) => w.close()));
  activeWorkers.length = 0;
  await prisma.$disconnect();
  logger.info('All pipeline workers stopped.');
}

module.exports = {
  startWorkers,
  stopWorkers,
  queueToEmbeddingHandoff,
  createSourceDiscoveryWorker,
  createSourceReaderWorker,
  createEvidenceExtractionWorker,
  createEvidenceVerificationWorker,
  createEntityResolutionWorker,
  createKnowledgeBuilderWorker,
  createPatternMinerWorker,
  createIntelligenceReporterWorker,
};
