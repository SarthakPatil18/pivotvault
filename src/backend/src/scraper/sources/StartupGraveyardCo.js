/**
 * StartupGraveyardCo Scraper Source (Dev 1)
 * Target URL: https://www.startupgraveyard.co
 * Extracts: name, category, failure reason
 */

const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../../lib/logger');

const BASE_URL = 'https://www.startupgraveyard.co';

const FALLBACK_SG_CO_STARTUPS = [
  {
    name: 'Vine',
    category: 'Social Media',
    failureReason: 'Flawed business model and monetization failure leading to mass creator defection to Instagram and YouTube.',
  },
  {
    name: 'Quibi',
    category: 'Entertainment / Streaming',
    failureReason: 'Failed to match consumer viewing behavior and locked out social sharing while burning $1.75B on premium short-form episodic video.',
  },
  {
    name: 'Juicero',
    category: 'Hardware / Consumer IoT',
    failureReason: 'Extreme over-engineering of a $400 Wi-Fi connected cold-press machine whose proprietary produce bags could be squeezed by hand.',
  },
  {
    name: 'Theranos',
    category: 'HealthTech / Diagnostics',
    failureReason: 'Technological impossibility and scientific fraud concealed from regulators and medical partners.',
  },
  {
    name: 'Pets.com',
    category: 'E-Commerce',
    failureReason: 'Negative gross margins shipping heavy pet food at subsidized prices with free delivery and unsustainable ad spending.',
  },
];

async function scrapeStartupGraveyardCo() {
  logger.info(`Running StartupGraveyardCo scraper on ${BASE_URL}...`);
  const results = [];

  try {
    const response = await axios.get(BASE_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // 1. Try extracting structured JSON-LD ItemList
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        const itemList = json.itemListElement || (json['@type'] === 'ItemList' ? json.itemListElement : null);
        if (Array.isArray(itemList)) {
          for (const item of itemList) {
            const name = item.name;
            const desc = item.description || '';
            const url = item.url || BASE_URL;

            if (name && desc) {
              // Extract Cause of Death / Failure reason from description
              let failureReason = desc;
              let category = 'Technology';

              const causeMatch = desc.match(/Cause of death:\s*([^.\n]+)/i);
              if (causeMatch) {
                failureReason = causeMatch[1].trim();
                category = failureReason.split(' ')[0] || 'Startup';
              }

              results.push({
                source: 'StartupGraveyardCo',
                title: `StartupGraveyardCo: ${name}`,
                url,
                content: `Startup: ${name}\nCategory: ${category}\nFailure Reason: ${failureReason}\nFull Description: ${desc}`,
                contentType: 'POSTMORTEM',
                author: 'StartupGraveyardCo Curator',
                publishedAt: new Date(),
                metadata: {
                  name,
                  category,
                  failureReason,
                },
              });
            }
          }
        }
      } catch (e) {
        // Continue to next script
      }
    });

    // 2. If JSON-LD didn't capture items, parse Next.js RSC payload regex
    if (results.length === 0) {
      const itemRegex = /"name":"([^"]+)","description":"([^"]+)"/g;
      let match;
      while ((match = itemRegex.exec(html)) !== null) {
        const name = match[1];
        const desc = match[2];
        if (name && !name.includes('Startup Graveyard') && desc.length > 20) {
          let failureReason = desc;
          const causeMatch = desc.match(/Cause of death:\s*([^.\\]+)/i);
          if (causeMatch) {
            failureReason = causeMatch[1].trim();
          }

          results.push({
            source: 'StartupGraveyardCo',
            title: `StartupGraveyardCo: ${name}`,
            url: `${BASE_URL}/startups/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            content: `Startup: ${name}\nCategory: Startup Failure\nFailure Reason: ${failureReason}\nDescription: ${desc}`,
            contentType: 'POSTMORTEM',
            author: 'StartupGraveyardCo Curator',
            publishedAt: new Date(),
            metadata: {
              name,
              category: 'Startup Failure',
              failureReason,
            },
          });
        }
      }
    }
  } catch (err) {
    logger.warn(`StartupGraveyardCo live scraping error: ${err.message}`);
  }

  // Fallback if needed
  if (results.length === 0) {
    for (const item of FALLBACK_SG_CO_STARTUPS) {
      results.push({
        source: 'StartupGraveyardCo',
        title: `StartupGraveyardCo: ${item.name}`,
        url: `${BASE_URL}/startups/${item.name.toLowerCase()}`,
        content: `Startup: ${item.name}\nCategory: ${item.category}\nFailure Reason: ${item.failureReason}`,
        contentType: 'POSTMORTEM',
        author: 'StartupGraveyardCo Curator',
        publishedAt: new Date(),
        metadata: {
          name: item.name,
          category: item.category,
          failureReason: item.failureReason,
          fallback: true,
        },
      });
    }
  }

  logger.info(`StartupGraveyardCo scraper finished with ${results.length} extracted items.`);
  return results;
}

module.exports = { scrapeStartupGraveyardCo };
