const JournalEntry = require('../models/JournalEntry');
const ChatHistory = require('../models/ChatHistory');
const { generateEmbedding } = require('./embeddingService');

const TOP_K_JOURNALS = 2;

function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function findSimilarJournals(userId, questionEmbedding) {
  const journals = await JournalEntry.find({
    user: userId,
    embedding: { $exists: true, $ne: [] },
  }).lean();

  const journalsWithScore = journals.map((journal) => ({
    ...journal,
    similarity: cosineSimilarity(questionEmbedding, journal.embedding),
  }));

  journalsWithScore.sort((a, b) => b.similarity - a.similarity);

  return journalsWithScore.slice(0, TOP_K_JOURNALS);
}

function summarizeJournal(journal) {
  const text = journal.fullText || journal.content || '';
  const trimmed = text.trim();
  return trimmed.length > 400 ? `${trimmed.slice(0, 400).trim()}...` : trimmed;
}

function buildChatPrompt(question, similarJournals) {
  const journalTexts = similarJournals.map((j, index) => {
    const summary = summarizeJournal(j);
    return `Journal ${index + 1}: ${summary}`;
  }).join('\n\n');

  return [
    'You are Melonote, a chill journaling chatbot assistant. You act like a calm therapist.',
    'Keep responses natural, under 25 words, and do not sound like an AI.',
    'Answer the user directly and gently, using the journal entries below only if they help.',
    'Complete the response fully in one short sentence and do not stop early or trail off.',
    '',
    'User question:',
    question,
    '',
    'Relevant journal summaries:',
    journalTexts,
    '',
    'Keep the tone warm, simple, and grounded.',
  ].join('\n');
}

async function generateLLMResponse(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured; returning placeholder response.');
    return 'I\'m here to help you reflect on your thoughts. Please check your Gemini API key configuration.';
  }

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 170,
          temperature: 0.45,
          topP: 0.85,
          candidateCount: 1,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`);
      return 'I\'m having trouble connecting to my knowledge base right now. Please try again later.';
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'I\'m not sure how to answer that.';
  } catch (error) {
    console.warn('LLM generation failed:', error.message);
    return 'I\'m having trouble connecting to my knowledge base right now. Please try again later.';
  }
}

async function chat(req, res) {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const questionEmbedding = await generateEmbedding(question.trim());

    if (!Array.isArray(questionEmbedding) || questionEmbedding.length === 0) {
      return res.status(500).json({ message: 'Failed to generate embedding for question' });
    }

    const similarJournals = await findSimilarJournals(req.user._id, questionEmbedding);

    const prompt = buildChatPrompt(question.trim(), similarJournals);

    const answer = await generateLLMResponse(prompt);

    const chatHistory = await ChatHistory.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          messages: {
            $each: [
              { role: 'user', content: question.trim() },
              { role: 'assistant', content: answer },
            ],
          },
        },
      },
      { new: true, upsert: true },
    );

    return res.json({
      answer,
      similarJournals: similarJournals.map((j) => ({
        _id: j._id,
        title: j.title,
        similarity: j.similarity,
      })),
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ message: 'Chat failed', error: error.message });
  }
}

module.exports = {
  chat,
  findSimilarJournals,
  cosineSimilarity,
};