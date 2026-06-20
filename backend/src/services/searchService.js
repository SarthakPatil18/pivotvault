const { tavily } = require("@tavily/core");

let client = null;
if (process.env.TAVILY_API_KEY) {
  try {
    client = tavily({ apiKey: process.env.TAVILY_API_KEY });
  } catch (err) {
    console.warn("Tavily client not initialized:", err.message);
  }
}

async function searchWeb(query, options = {}) {
  if (!client) {
    console.warn("Tavily client unavailable, returning empty results");
    return [];
  }
  
  try {
    const result = await client.search(query, {
      maxResults: options.maxResults || 5,
      searchDepth: options.searchDepth || "basic",
      includeAnswer: options.includeAnswer || false,
      includeRawContent: false,
    });
    return result.results || [];
  } catch (err) {
    console.error("Tavily search failed:", err.message);
    return [];
  }
}

async function researchStartup(startupName) {
  const queries = [
    `${startupName} startup failure funding history`,
    `${startupName} startup shutdown news articles`,
    `${startupName} founder interviews lessons learned`,
    `${startupName} startup acquisition timeline`,
    `${startupName} startup market reaction public timeline`,
  ];

  const allResults = [];
  
  for (const query of queries.slice(0, 3)) { // Limit to 3 queries to avoid rate limits
    const results = await searchWeb(query, { maxResults: 3 });
    allResults.push(...results);
  }

  // Deduplicate and format results
  const seenUrls = new Set();
  const formattedSources = [];

  for (const result of allResults) {
    if (seenUrls.has(result.url)) continue;
    seenUrls.add(result.url);
    
    formattedSources.push({
      title: result.title,
      publisher: extractPublisher(result.url),
      date: result.publishedDate || null,
      summary: result.content || result.snippet || "",
      url: result.url,
    });
  }

  return formattedSources.slice(0, 10); // Limit to top 10 sources
}

function extractPublisher(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "Unknown Source";
  }
}

module.exports = { searchWeb, researchStartup };
