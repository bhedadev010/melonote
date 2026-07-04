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

module.exports = {
  sparkIdea,
};
