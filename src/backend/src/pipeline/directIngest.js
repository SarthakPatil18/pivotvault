/**
 * PivotVault Direct Ingestion Script (Dev 1)
 * Runs all web scrapers (including the 4 graveyard sources) and directly
 * persists all startups, evidence, claims, and failure factors into PostgreSQL
 * via Prisma, without requiring a running Redis instance.
 */

const { PrismaClient } = require('@prisma/client');
const { runAllScrapers } = require('../scraper');
const logger = require('../lib/logger');

const prisma = new PrismaClient();

async function runDirectIngestion() {
  logger.info('=====================================================');
  logger.info('  Starting Direct Scraper-to-Database Ingestion      ');
  logger.info('=====================================================');

  try {
    // 1. Run all scrapers across sources
    const scrapedItems = await runAllScrapers();
    logger.info(`Scraped ${scrapedItems.length} total raw items. Beginning DB ingestion...`);

    let createdCount = 0;
    let updatedCount = 0;

    // 2. Process items in concurrent batches of 5 for high performance
    const BATCH_SIZE = 5;
    for (let i = 0; i < scrapedItems.length; i += BATCH_SIZE) {
      const batch = scrapedItems.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (item) => {
          if (!item.url || !item.title) return;

          const candidateName =
            item.metadata?.name ||
            item.title
              .split(':')[0]
              .split('—')[0]
              .replace(/YC RFS|Failory Cemetery|IndieHackers|ProductHunt|StartupGraveyard/gi, '')
              .trim();

          if (!candidateName || candidateName.length < 2) return;

          const slug = (item.metadata?.slug || candidateName)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          try {
            // Upsert Evidence
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
                  publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
                  metadata: item.metadata || {},
                },
              });
            }

            // Upsert Company
            const failureReason = item.metadata?.reason || item.metadata?.failureReason || item.metadata?.failureSummary || '';
            const industry = item.metadata?.industry || item.metadata?.category || 'Technology / Startup';

            const existingCompany = await prisma.company.findUnique({
              where: { slug },
            });

            let company;
            if (!existingCompany) {
              company = await prisma.company.create({
                data: {
                  name: candidateName,
                  slug,
                  description: item.content.slice(0, 500),
                  industry,
                  foundedYear: item.metadata?.founded ? parseInt(item.metadata.founded, 10) : null,
                  failureYear: item.metadata?.closed ? parseInt(item.metadata.closed, 10) : null,
                  failureReasons: failureReason ? [failureReason] : [],
                  keyLessons: [],
                  postmortemSummary: item.content.slice(0, 1000),
                  enriched: false,
                },
              });
              createdCount++;
              logger.info(`[DirectIngest] Created Company: ${company.name} [slug: ${slug}]`);
            } else {
              const updatedReasons = failureReason && !existingCompany.failureReasons.includes(failureReason)
                ? [...existingCompany.failureReasons, failureReason]
                : existingCompany.failureReasons;

              company = await prisma.company.update({
                where: { id: existingCompany.id },
                data: { failureReasons: updatedReasons },
              });
              updatedCount++;
            }

            // Link Evidence
            await prisma.evidence.update({
              where: { id: evidence.id },
              data: { companyId: company.id },
            });

            // Add Claim if failure reason exists
            if (failureReason) {
              await prisma.claim.create({
                data: {
                  companyId: company.id,
                  evidenceId: evidence.id,
                  claimText: failureReason,
                  category: 'MARKET',
                  verificationStatus: 'PARTIALLY_VERIFIED',
                  confidenceScore: 0.85,
                  sources: [item.source],
                  verifiedAt: new Date(),
                },
              });
            }
          } catch (itemErr) {
            logger.warn(`Failed ingesting item "${item.title}": ${itemErr.message}`);
          }
        })
      );
    }

    const totalInDb = await prisma.company.count();
    logger.info(`Ingestion complete! Created: ${createdCount}, Updated: ${updatedCount}. Total Companies in DB: ${totalInDb}`);
    return { createdCount, updatedCount, totalInDb };
  } catch (err) {
    logger.error(`Direct ingestion failed: ${err.message}`, { stack: err.stack });
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runDirectIngestion()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runDirectIngestion };
