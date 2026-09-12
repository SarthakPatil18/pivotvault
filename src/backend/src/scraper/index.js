/**
 * PivotVault Scraper Registry & Runner (Dev 1)
 * Coordinates scraping across all sources and validates schema consistency.
 */

const { scrapeStartupGraveyard } = require('./sources/StartupGraveyard');
const { scrapeFailory } = require('./sources/Failory');
const { scrapeTheStartupGraveyard } = require('./sources/TheStartupGraveyard');
const { scrapeStartupGraveyardCo } = require('./sources/StartupGraveyardCo');
const { scrapeHackerNews } = require('./sources/hackernews');
const { scrapeReddit } = require('./sources/reddit');
const { scrapeYCombinator } = require('./sources/ycombinator');
const { scrapeProductHunt } = require('./sources/producthunt');
const { scrapeIndieHackers } = require('./sources/indiehackers');
const { scrapeTechCrunch } = require('./sources/techcrunch');
const logger = require('../lib/logger');

const SCRAPERS = {
  // Specific Cemetery Sources
  startupgraveyard: scrapeStartupGraveyard,
  failory: scrapeFailory,
  thestartupgraveyard: scrapeTheStartupGraveyard,
  startupgraveyardco: scrapeStartupGraveyardCo,

  // Broader Idea & News Sources
  hackernews: scrapeHackerNews,
  reddit: scrapeReddit,
  ycombinator: scrapeYCombinator,
  producthunt: scrapeProductHunt,
  indiehackers: scrapeIndieHackers,
  techcrunch: scrapeTechCrunch,
};

/**
 * Runs a specific scraper by name
 */
async function runScraper(sourceName) {
  const normalizedName = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const scraper = SCRAPERS[normalizedName] || SCRAPERS[sourceName.toLowerCase()];

  if (!scraper) {
    throw new Error(`Scraper for source "${sourceName}" is not registered. Available: ${Object.keys(SCRAPERS).join(', ')}`);
  }

  logger.info(`Invoking scraper [${sourceName}]...`);
  try {
    const results = await scraper();
    return results;
  } catch (err) {
    logger.error(`Failed executing scraper [${sourceName}]: ${err.message}`);
    return [];
  }
}

/**
 * Runs all scrapers in parallel with allSettled
 */
async function runAllScrapers() {
  logger.info('Starting full scraper sweep across all sources...');
  const scraperKeys = Object.keys(SCRAPERS);

  const settleResults = await Promise.allSettled(
    scraperKeys.map((key) => SCRAPERS[key]())
  );

  const aggregated = [];
  settleResults.forEach((res, idx) => {
    const sourceKey = scraperKeys[idx];
    if (res.status === 'fulfilled') {
      aggregated.push(...res.value);
      logger.info(`Source [${sourceKey}] yielded ${res.value.length} items.`);
    } else {
      logger.error(`Source [${sourceKey}] failed: ${res.reason?.message}`);
    }
  });

  logger.info(`Scraper sweep complete. Aggregated ${aggregated.length} total raw evidence records.`);
  return aggregated;
}

module.exports = {
  SCRAPERS,
  runScraper,
  runAllScrapers,
  scrapeStartupGraveyard,
  scrapeFailory,
  scrapeTheStartupGraveyard,
  scrapeStartupGraveyardCo,
};
