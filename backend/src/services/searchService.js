const { TavilyClient } = require("tavily");

const tavily = new TavilyClient({
  apiKey: process.env.TAVILY_API_KEY,
});

async function searchWeb(query) {
  const result = await tavily.search(query);
  return result.results;
}

module.exports = { searchWeb };