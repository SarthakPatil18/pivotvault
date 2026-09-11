const write = (category, name, message, data) => console.info(`[${new Date().toISOString()}][${category}][${name}] ${message}`, data ?? '');
const log = {
  agent: (agentName, message, data) => write('AGENT', agentName, message, data),
  worker: (workerName, jobId, status) => write('WORKER', workerName, status, { jobId }),
  rag: (operation, chunks, duration) => write('RAG', operation, 'completed', { chunks, duration }),
  external: (source, query, resultCount) => write('EXTERNAL', source, 'completed', { query, resultCount }),
};
module.exports = { log };
