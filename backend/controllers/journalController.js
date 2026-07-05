const JournalEntry = require('../models/JournalEntry');
const { buildSparkIdeaPrompt } = require('../utils/ai');
const { processEntryAsync } = require('../services/journalProcessingService');
const { chat } = require('../services/chatbotService');

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

        const fullTextValue = fullText?.trim() || content.trim();
    const entry = await JournalEntry.create({
      user: req.user._id,
      title: title?.trim() || 'Untitled entry',
      content: content.trim(),
      fullText: fullTextValue,
      messages: messages || [],
      emotions: [],
      embedding: [],
    });

    processEntryAsync(entry._id.toString(), fullTextValue);

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

async function getEntry(req, res) {
  try {
    const entry = await JournalEntry.findOne({ _id: req.params.id, user: req.user._id });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    return res.json({ entry });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch journal entry', error: error.message });
  }
}

async function updateEntry(req, res) {
  try {
    const { title, content, fullText, messages } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Entry content is required' });
    }

    const fullTextValue = fullText?.trim() || content.trim();
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: title?.trim() || 'Untitled entry',
        content: content.trim(),
        fullText: fullTextValue,
        messages: messages || [],
      },
      { new: true },
    );

    if (entry) {
      processEntryAsync(entry._id.toString(), fullTextValue);
    }

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    return res.json({ entry });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update journal entry', error: error.message });
  }
}

async function deleteEntry(req, res) {
  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    return res.json({ message: 'Entry deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete journal entry', error: error.message });
  }
}

module.exports = {
  sparkIdea,
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  chat,
};
