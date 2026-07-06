const SPARK_QUESTIONS = [
  "What part of this experience feels most important to you right now?",
  "How did this moment change the way you see yourself?",
  "What would you tell your future self about this?",
  "What feeling is lingering beneath the surface of what you wrote?",
  "If you could go back, would you do anything differently?",
  "What did you learn about someone else through this?",
  "What does this reveal about what you truly value?",
  "Where do you feel this emotion in your body?",
  "What would you need to feel at peace with this?",
  "Is there something you're not saying that wants to be heard?",
  "What small kindness did you experience today?",
  "What are you more curious about after writing this?",
  "What would it look like to let go of this?",
  "Who would you be without this thought?",
  "What is one thing you want to remember from this moment?",
];

function getRandomSparkQuestion() {
  const index = Math.floor(Math.random() * SPARK_QUESTIONS.length);
  return SPARK_QUESTIONS[index];
}

function buildSparkIdeaPrompt(journalText) {
  return [
    'Read the journal context below and suggest one reflective question.',
    'Keep it gentle, specific, and useful for deeper journaling.',
    '',
    'Journal context:',
    journalText,
    '',
    'Return only one question.',
  ].join('\n');
}

module.exports = {
  buildSparkIdeaPrompt,
  getRandomSparkQuestion,
};
