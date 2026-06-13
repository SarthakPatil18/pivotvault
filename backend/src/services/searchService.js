const { tavily } = require("@tavily/core");

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function searchWeb(query) {
  const result = await client.search(query);
  return result.results;
}

module.exports = { searchWeb };