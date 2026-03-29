function extractMentions(text) {
  // Matches @username (alphanumeric and underscores)
  return (text.match(/@([a-zA-Z0-9_]+)/g) || []).map((m) => m.slice(1));
}

module.exports = extractMentions;
