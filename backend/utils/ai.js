function buildSparkIdeaPrompt(text) {
  return [
    'You are helping a user reflect on their journal entry.',
    'Generate exactly one thoughtful, reflective question based on the following journal text.',
    'Keep it short, calm, and encouraging.',
    'Do not write multiple questions or a full answer.',
    `Journal text: ${text}`,
  ].join('\n');
}

module.exports = {
  buildSparkIdeaPrompt,
};
