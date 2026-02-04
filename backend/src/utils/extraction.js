function extractJson(text) {
  if (typeof text !== 'string') return null;

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) return null;

  const jsonString = text.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

module.exports = { extractJson };
