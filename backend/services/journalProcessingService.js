const JournalEntry = require('../models/JournalEntry');
const { detectEmotion } = require('./emotionService');
const { generateEmbedding } = require('./embeddingService');

async function processEntryAsync(entryId, fullText) {
  try {
    const [emotions, embedding] = await Promise.all([
      detectEmotion(fullText),
      generateEmbedding(fullText),
    ]);

    await JournalEntry.findByIdAndUpdate(entryId, {
      emotions,
      embedding,
    });
  } catch (error) {
    console.warn(`Background journal processing failed for entry ${entryId}:`, error.message);
  }
}

module.exports = {
  processEntryAsync,
};