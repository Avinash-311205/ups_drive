const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8001';

async function queryRag(question) {
  try {
    const response = await fetch(`${RAG_SERVICE_URL}/qa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, top_k: 3 }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) return null;

    const result = await response.json();
    return typeof result.answer === 'string' && result.answer.trim()
      ? result.answer.trim()
      : null;
  } catch (error) {
    console.error('RAG service unavailable; using the local knowledge base:', error.message);
    return null;
  }
}

module.exports = { queryRag };
