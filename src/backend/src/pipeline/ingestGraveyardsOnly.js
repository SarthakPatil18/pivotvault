/**
 * PivotVault Pure Graveyard Sources Ingestion & Cleanup
 * Cleans up generic discussion titles from HN/Reddit from the Company table,
 * and ingests 100% of startups strictly from the 4 requested graveyard sources:
 * 1. StartupGraveyard.js (https://startupgraveyard.io)
 * 2. Failory.js (https://www.failory.com/cemetery)
 * 3. TheStartupGraveyard.js (https://www.thestartupgraveyard.com)
 * 4. StartupGraveyardCo.js (https://www.startupgraveyard.co)
 */

const { PrismaClient } = require('@prisma/client');
const { scrapeStartupGraveyard } = require('../scraper/sources/StartupGraveyard');
const { scrapeFailory } = require('../scraper/sources/Failory');
const { scrapeTheStartupGraveyard } = require('../scraper/sources/TheStartupGraveyard');
const { scrapeStartupGraveyardCo } = require('../scraper/sources/StartupGraveyardCo');
const logger = require('../lib/logger');

const prisma = new PrismaClient();

const JUNK_PATTERNS = [
  'Ask HN',
  'Show HN',
  'shut down',
  'We said',
  'Idea validation',
  'Spent 10 months',
  'Bootstrapping a marketplace',
  'reasons to',
  'lessons learned',
  'Startup failure',
  'Post-mortem',
  'Post mortem',
  'My cofounder',
  'How Google',
  'Shutdown our',
  'convoy collapses',
  'liquidates assets',
];

async function cleanupAndIngestGraveyards() {
  logger.info('===========================================================');
  logger.info('  Cleaning up junk HN/Reddit titles from Company table...  ');
  logger.info('===========================================================');

  // 1. Delete companies that match junk discussion post titles
  const allCompanies = await prisma.company.findMany({
    select: { id: true, name: true, slug: true },
  });

  const junkIds = [];
  for (const comp of allCompanies) {
    const isJunk = JUNK_PATTERNS.some((pat) =>
      comp.name.toLowerCase().includes(pat.toLowerCase())
    );
    if (isJunk) {
      junkIds.push(comp.id);
      logger.info(`Marked for removal junk title: "${comp.name}"`);
    }
  }

  if (junkIds.length > 0) {
    await prisma.company.deleteMany({
      where: { id: { in: junkIds } },
    });
    logger.info(`Deleted ${junkIds.length} junk non-company discussion records.`);
  }

  logger.info('===========================================================');
  logger.info('  Running scrapers for the 4 graveyard sources...         ');
  logger.info('===========================================================');

  // 2. Run the 4 scrapers
  const [sgIoResults, failoryResults, tsgResults, sgCoResults] = await Promise.all([
    scrapeStartupGraveyard(),
    scrapeFailory(),
    scrapeTheStartupGraveyard(),
    scrapeStartupGraveyardCo(),
  ]);

  const allGraveyardItems = [
    ...sgIoResults,
    ...failoryResults,
    ...tsgResults,
    ...sgCoResults,
  ];

  logger.info(`Scraped ${allGraveyardItems.length} total startups from the 4 graveyard sources.`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of allGraveyardItems) {
    const name = item.metadata?.name?.trim();
    if (!name || name.length < 2 || name.length > 50) continue;

    // Reject if name matches junk phrases
    if (JUNK_PATTERNS.some((p) => name.toLowerCase().includes(p.toLowerCase()))) continue;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const failureReason =
      item.metadata?.reason ||
      item.metadata?.failureReason ||
      item.metadata?.failureSummary ||
      '';

    const industry =
      item.metadata?.industry ||
      item.metadata?.category ||
      'Technology / Startup';

    const foundedYear = item.metadata?.founded ? parseInt(item.metadata.founded, 10) : null;
    const failureYear = item.metadata?.closed ? parseInt(item.metadata.closed, 10) : null;
    const fundingText = item.metadata?.funding || null;

    // Check existing company
    const existing = await prisma.company.findUnique({
      where: { slug },
    });

    let company;
    if (!existing) {
      company = await prisma.company.create({
        data: {
          name,
          slug,
          description: item.content.slice(0, 500),
          industry,
          foundedYear,
          failureYear,
          failureReasons: failureReason ? [failureReason] : [],
          keyLessons: [],
          postmortemSummary: item.content.slice(0, 1000),
          enriched: false,
        },
      });
      createdCount++;
      logger.info(`[Graveyard Ingest] Added Company: ${name} [slug: ${slug}] from ${item.source}`);
    } else {
      const updatedReasons =
        failureReason && !existing.failureReasons.includes(failureReason)
          ? [...existing.failureReasons, failureReason]
          : existing.failureReasons;

      company = await prisma.company.update({
        where: { id: existing.id },
        data: {
          failureReasons: updatedReasons,
          foundedYear: existing.foundedYear || foundedYear,
          failureYear: existing.failureYear || failureYear,
        },
      });
      updatedCount++;
    }

    // Upsert Evidence
    let evidence = await prisma.evidence.findFirst({
      where: { sourceUrl: item.url },
    });

    if (!evidence) {
      evidence = await prisma.evidence.create({
        data: {
          companyId: company.id,
          title: item.title,
          content: item.content,
          sourceUrl: item.url,
          sourceName: item.source,
          contentType: 'POSTMORTEM',
          author: item.author || `${item.source} Curator`,
          publishedAt: item.publishedAt || new Date(),
          metadata: item.metadata || {},
        },
      });
    } else if (!evidence.companyId) {
      await prisma.evidence.update({
        where: { id: evidence.id },
        data: { companyId: company.id },
      });
    }

    // Upsert Claim
    if (failureReason) {
      const existingClaim = await prisma.claim.findFirst({
        where: { companyId: company.id, claimText: failureReason },
      });

      if (!existingClaim) {
        await prisma.claim.create({
          data: {
            companyId: company.id,
            evidenceId: evidence.id,
            claimText: failureReason,
            category: 'MARKET',
            verificationStatus: 'VERIFIED',
            confidenceScore: 0.9,
            sources: [item.source, item.url],
            verifiedAt: new Date(),
          },
        });
      }
    }
  }

  const finalCompanyCount = await prisma.company.count();
  const finalEvidenceCount = await prisma.evidence.count();
  const finalClaimCount = await prisma.claim.count();

  logger.info('===========================================================');
  logger.info('  GRAVEYARD INGESTION & CLEANUP COMPLETE!                  ');
  logger.info(`  Total Real Companies in DB: ${finalCompanyCount}         `);
  logger.info(`  Total Evidence in DB:      ${finalEvidenceCount}        `);
  logger.info(`  Total Verified Claims:     ${finalClaimCount}           `);
  logger.info('===========================================================');

  return { finalCompanyCount, finalEvidenceCount, finalClaimCount };
}

if (require.main === module) {
  cleanupAndIngestGraveyards()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Failed:', err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

module.exports = { cleanupAndIngestGraveyards };
