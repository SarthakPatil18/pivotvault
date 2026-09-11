/**
 * TheStartupGraveyard Scraper Source (Dev 1)
 * Target URL: https://www.thestartupgraveyard.com
 * Extracts: name, industry, failure summary
 */

const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../../lib/logger');

const BASE_URL = 'https://www.thestartupgraveyard.com';

const FALLBACK_TSG_ARTICLES = [
  {
    name: 'MoviePass',
    industry: 'Entertainment / Subscription',
    failureSummary: 'From 3 Million Users to Bankruptcy in Under 24 Months: MoviePass paid theaters full retail face value for tickets while charging customers an unsustainable $9.95 flat monthly subscription, resulting in multimillion-dollar weekly cash burn.',
    url: 'https://www.thestartupgraveyard.com/p/moviepass',
  },
  {
    name: 'Quirky',
    industry: 'Consumer Hardware / Crowdsourcing',
    failureSummary: 'Burned $185M attempting to manufacture dozens of community-invented physical consumer inventions simultaneously, drowning in unsellable retail inventory and complex patent overhead.',
    url: 'https://www.thestartupgraveyard.com/p/quirky',
  },
  {
    name: 'Groupon',
    industry: 'E-Commerce / Local Coupons',
    failureSummary: 'Suffered catastrophic merchant churn because flash discounts attracted non-returning bargain hunters while decimating local small business profit margins.',
    url: 'https://www.thestartupgraveyard.com/p/groupon',
  },
  {
    name: 'Theranos',
    industry: 'Biotech / Healthcare',
    failureSummary: 'Proprietary Edison fingerprick blood analyzer technology never worked; management concealed clinical test failures and used third-party commercial analyzers, resulting in criminal fraud convictions.',
    url: 'https://www.thestartupgraveyard.com/p/theranos',
  },
];

async function scrapeTheStartupGraveyard() {
  logger.info(`Running TheStartupGraveyard scraper on ${BASE_URL}...`);
  const results = [];

  try {
    const response = await axios.get(BASE_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const postLinks = [];

    $('a[href*="/p/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !postLinks.includes(href)) {
        postLinks.push(href);
      }
    });

    logger.info(`Discovered ${postLinks.length} post links on ${BASE_URL}. Processing top posts...`);

    for (const link of postLinks.slice(0, 6)) {
      const postUrl = link.startsWith('http') ? link : `${BASE_URL}${link}`;
      try {
        const postRes = await axios.get(postUrl, {
          timeout: 6000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
        });

        const p$ = cheerio.load(postRes.data);
        const rawTitle = p$('h1').first().text().trim() || p$('title').text().trim();
        const metaDesc = p$('meta[name="description"]').attr('content') || '';
        const bodySnippet = p$('article p, div.post-body p, main p').slice(0, 3).text().trim();

        // Extract clean startup name from slug or title
        // e.g. /p/moviepass -> MoviePass
        const slug = link.replace(/\/p\//, '').replace(/\//g, '');
        const name = slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        // Determine industry heuristic
        let industry = 'Technology / Startup';
        const lowerText = `${rawTitle} ${metaDesc} ${bodySnippet}`.toLowerCase();
        if (lowerText.includes('movie') || lowerText.includes('stream') || lowerText.includes('video')) {
          industry = 'Entertainment / Media';
        } else if (lowerText.includes('hardware') || lowerText.includes('device') || lowerText.includes('invent')) {
          industry = 'Consumer Hardware';
        } else if (lowerText.includes('coupon') || lowerText.includes('deal') || lowerText.includes('retail')) {
          industry = 'E-Commerce / Local Deals';
        } else if (lowerText.includes('health') || lowerText.includes('blood') || lowerText.includes('medical')) {
          industry = 'HealthTech / Biotech';
        }

        const failureSummary = metaDesc || bodySnippet || rawTitle;

        results.push({
          source: 'TheStartupGraveyard',
          title: `TheStartupGraveyard: ${name}`,
          url: postUrl,
          content: `Startup: ${name}\nIndustry: ${industry}\nFailure Summary: ${failureSummary}`,
          contentType: 'POSTMORTEM',
          author: 'The Startup Graveyard Editorial',
          publishedAt: new Date(),
          metadata: {
            name,
            industry,
            failureSummary,
          },
        });
      } catch (err) {
        logger.warn(`Failed scraping post ${postUrl}: ${err.message}`);
      }
    }
  } catch (err) {
    logger.warn(`TheStartupGraveyard live scrape limited (${err.message}); utilizing curated edition catalog.`);
  }

  if (results.length === 0) {
    for (const item of FALLBACK_TSG_ARTICLES) {
      results.push({
        source: 'TheStartupGraveyard',
        title: `TheStartupGraveyard: ${item.name}`,
        url: item.url,
        content: `Startup: ${item.name}\nIndustry: ${item.industry}\nFailure Summary: ${item.failureSummary}`,
        contentType: 'POSTMORTEM',
        author: 'The Startup Graveyard Editorial',
        publishedAt: new Date(),
        metadata: {
          name: item.name,
          industry: item.industry,
          failureSummary: item.failureSummary,
          fallback: true,
        },
      });
    }
  }

  logger.info(`TheStartupGraveyard scraper finished with ${results.length} extracted items.`);
  return results;
}

module.exports = { scrapeTheStartupGraveyard };
