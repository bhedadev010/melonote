const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSparkIdeaPrompt } = require('../utils/ai');

test('buildSparkIdeaPrompt includes the journal context and asks for a single reflective question', () => {
  const prompt = buildSparkIdeaPrompt('I felt calm and grateful today.');

  assert.match(prompt, /reflective question/i);
  assert.match(prompt, /I felt calm and grateful today/i);
  assert.match(prompt, /one/i);
});
