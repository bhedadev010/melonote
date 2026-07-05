const JournalEntry = require('../models/JournalEntry');
const { buildSparkIdeaPrompt } = require('../utils/ai');

async function sparkIdea(req, res) {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Journal text is required' });
    }

    const prompt = buildSparkIdeaPrompt(text);

    const idea = `What part of this experience feels most important to you right now?`;

    return res.json({ idea, prompt });
  } catch (error) {
    return res.status(500).json({ message: 'Spark idea failed', error: error.message });
  }
}

async function createEntry(req, res) {
  try {
    const { title, content, fullText, messages } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Entry content is required' });
    }

    const entry = await JournalEntry.create({
      user: req.user._id,
      title: title?.trim() || 'Untitled entry',
      content: content.trim(),
      fullText: fullText?.trim() || content.trim(),
      messages: messages || [],
    });

    return res.status(201).json({ entry });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save journal entry', error: error.message });
  }
}

async function getEntries(req, res) {
  try {
    const entries = await JournalEntry.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({ entries });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch journal entries', error: error.message });
  }
}

module.exports = {
  sparkIdea,
  createEntry,
  getEntries,
};
