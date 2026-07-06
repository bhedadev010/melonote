const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSparkIdeaPrompt } = require('../utils/ai');
const {
  buildJournalContextFallbackAnswer,
  isIncompleteReply,
  polishChatReply,
} = require('../services/chatbotService');

test('buildSparkIdeaPrompt includes the journal context and asks for a single reflective question', () => {
  const prompt = buildSparkIdeaPrompt('I felt calm and grateful today.');

  assert.match(prompt, /reflective question/i);
  assert.match(prompt, /I felt calm and grateful today/i);
  assert.match(prompt, /one/i);
});

test('isIncompleteReply flags fragment-style replies', () => {
  assert.equal(isIncompleteReply('It feels like'), true);
  assert.equal(isIncompleteReply('It feels like you are carrying a lot today.'), false);
  assert.equal(isIncompleteReply('I can help you'), true);
  assert.equal(isIncompleteReply('Yes, your journal mentions a "burden of someone else"'), true);
});

test('polishChatReply fixes answers that are only missing punctuation', () => {
  assert.equal(
    polishChatReply('Yes, your journal mentions a "burden of someone else"'),
    'Yes, your journal mentions a "burden of someone else."',
  );
});

test('buildJournalContextFallbackAnswer gives a useful burden answer from journal text', () => {
  const answer = buildJournalContextFallbackAnswer('do i have burden?', [
    { fullText: 'Today I wrote about the burden of someone else and how heavy it felt.' },
  ]);

  assert.match(answer, /^Yes/i);
  assert.match(answer, /burden/i);
  assert.doesNotMatch(answer, /generated response/i);
});
