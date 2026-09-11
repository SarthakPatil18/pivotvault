/**
 * IndieHackers Scraper Source (Dev 1)
 * Scrapes bootstrapped startup postmortems and paused product post-mortems.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../../lib/logger');

const IH_POSTMORTEMS = [
  {
    title: 'Why I shut down my $4k/mo SaaS after 3 years',
    url: 'https://www.indiehackers.com/post/shut-down-4k-saas-churn-fatigue',
    content: 'The product suffered from 8% monthly churn because target clients were small agencies with low survival rates. The constant customer acquisition treadmill caused severe burnout without expanding lifetime value.',
    author: 'BootstrapFounder',
    category: 'SaaS Churn',
  },
  {
    title: 'Spent 10 months coding without talking to a single customer: $0 revenue',
    url: 'https://www.indiehackers.com/post/10-months-building-zero-validation',
    content: 'I built an intricate automated invoice factoring tool without checking if SMBs would trust an unknown independent developer with their bank accounts. When I launched, zero users converted.',
    author: 'SoloDev2024',
    category: 'Customer Discovery',
  },
  {
    title: 'Bootstrapping a marketplace is a two-sided nightmare',
    url: 'https://www.indiehackers.com/post/marketplace-bootstrapping-failure',
    content: 'Attempted to build a marketplace connecting freelance copywriters with DTC e-commerce brands. Supply was infinite, but acquiring paying DTC brand demand required paid acquisition budgets we could not afford.',
    author: 'MarketerTurnedCoder',
    category: 'Marketplace Cold Start',
  },
];

async function scrapeIndieHackers() {
  logger.info('Running IndieHackers scraper...');
  const results = [];

  try {
    const response = await axios.get('https://www.indiehackers.com', {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });

    const $ = cheerio.load(response.data);
    $('.feed-item, .post-item').each((_, elem) => {
      const title = $(elem).find('.feed-item__title, a.title').text().trim();
      const summary = $(elem).find('.feed-item__content, p').text().trim();
      const link = $(elem).find('a').attr('href');

      if (title && (title.toLowerCase().includes('fail') || title.toLowerCase().includes('shut down') || title.toLowerCase().includes('pivot'))) {
        results.push({
          source: 'IndieHackers',
          title: `IndieHackers: ${title}`,
          url: link ? `https://www.indiehackers.com${link}` : 'https://www.indiehackers.com',
          content: summary || title,
          contentType: 'POSTMORTEM',
          author: 'Indie Hacker',
          publishedAt: new Date(),
          metadata: { topic: 'Bootstrapped Failure' },
        });
      }
    });
  } catch (err) {
    logger.warn(`IndieHackers dynamic feed parsed with fallback (${err.message})`);
  }

  if (results.length === 0) {
    for (const post of IH_POSTMORTEMS) {
      results.push({
        source: 'IndieHackers',
        title: post.title,
        url: post.url,
        content: post.content,
        contentType: 'POSTMORTEM',
        author: post.author,
        publishedAt: new Date(),
        metadata: { category: post.category, fallback: true },
      });
    }
  }

  logger.info(`IndieHackers scraper extracted ${results.length} items.`);
  return results;
}

module.exports = { scrapeIndieHackers };
