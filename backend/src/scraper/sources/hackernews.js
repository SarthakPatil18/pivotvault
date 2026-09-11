/**
 * HackerNews Scraper Source (Dev 1)
 * Extracts startup postmortems, shutdown reflections, and startup idea discussions
 * using the public HackerNews Algolia Search API.
 */

const axios = require('axios');
const logger = require('../../lib/logger');

const HN_SEARCH_QUERIES = [
  { query: 'Ask HN: Why did your startup fail', contentType: 'POSTMORTEM' },
  { query: 'startup postmortem lessons learned', contentType: 'POSTMORTEM' },
  { query: 'shutdown our startup', contentType: 'POSTMORTEM' },
  { query: 'Ask HN: Idea validation feedback', contentType: 'IDEA' },
  { query: 'Show HN: Looking for cofounders and market feedback', contentType: 'IDEA' },
];

async function scrapeHackerNews(limitPerQuery = 5) {
  logger.info('Running HackerNews scraper...');
  const results = [];

  for (const { query, contentType } of HN_SEARCH_QUERIES) {
    try {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limitPerQuery}`;
      const response = await axios.get(url, {
        timeout: 8000,
        headers: { 'User-Agent': 'PivotVault-Intelligence/1.0' },
      });

      const hits = response.data?.hits || [];
      for (const hit of hits) {
        if (!hit.title) continue;

        // HN stories may have story_text (Ask HN) or external url
        const rawContent = hit.story_text || hit.title;
        const cleanContent = rawContent.replace(/<[^>]*>?/gm, '').trim();

        results.push({
          source: 'HackerNews',
          title: hit.title,
          url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          content: cleanContent,
          contentType: contentType,
          author: hit.author || 'Anonymous HN User',
          publishedAt: hit.created_at ? new Date(hit.created_at) : new Date(),
          metadata: {
            hnStoryId: hit.objectID,
            points: hit.points || 0,
            numComments: hit.num_comments || 0,
            queryUsed: query,
          },
        });
      }
    } catch (err) {
      logger.warn(`HackerNews scraper error for query "${query}": ${err.message}`);
    }
  }

  logger.info(`HackerNews scraper extracted ${results.length} items.`);
  return results;
}

module.exports = { scrapeHackerNews };
