const JournalEntry = require('../models/JournalEntry');
const ChatHistory = require('../models/ChatHistory');
const { generateEmbedding } = require('./embeddingService');

const TOP_K_JOURNALS = 2;
const MAX_CHAT_GENERATION_ATTEMPTS = 3;
const INCOMPLETE_ENDINGS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'because',
  'but',
  'by',
  'can',
  'could',
  'for',
  'from',
  'has',
  'have',
  'in',
  'is',
  'it',
  'like',
  'may',
  'might',
  'of',
  'or',
  'should',
  'that',
  'the',
  'this',
  'to',
  'was',
  'were',
  'will',
  'with',
  'would',
  'you',
  'your',
]);

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
    'You are Melonote, a warm and thoughtful journaling assistant.',
    'Answer the user\'s question directly, clearly, and completely before adding reflection.',
    'Use the relevant journal summaries only when they genuinely help answer the question.',
    'If the journals do not contain enough context, say so briefly and still give the best helpful answer you can.',
    'For yes-or-no questions, start with a clear yes, no, or not enough context, then explain briefly.',
    'Keep the response concise but not rushed: usually 2-4 short sentences, or a few bullets if that is clearer.',
    'Do not invent details about the user or their journals. Do not sound robotic, clinical, or overly vague.',
    'Finish with a grounded next step, gentle question, or practical suggestion when useful.',
    '',
    'User question:',
    question,
    '',
    'Relevant journal summaries:',
    journalTexts || 'No relevant journal summaries were found.',
    '',
    'Tone: calm, honest, specific, supportive, and easy to understand.',
  ].join('\n');
}

function hasUnclosedQuote(text) {
  const straightQuotes = (text.match(/"/g) || []).length;
  const leftQuotes = (text.match(/\u201c/g) || []).length;
  const rightQuotes = (text.match(/\u201d/g) || []).length;

  return straightQuotes % 2 !== 0 || leftQuotes !== rightQuotes;
}

function hasTerminalPunctuation(text) {
  const withoutClosingMarks = text.trim().replace(/["')\]]+$/g, '');
  return /[.!?]$/.test(withoutClosingMarks);
}

function getReplyWords(text) {
  return text
    .replace(/[.!?'"\u201c\u201d]+$/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

function endsWithHardFragment(text) {
  const trimmed = text.trim();
  const words = getReplyWords(trimmed);
  const lastWord = words.at(-1)?.toLowerCase();

  return (
    trimmed.endsWith('...')
    || /[,;:([\-]$/.test(trimmed)
    || hasUnclosedQuote(trimmed)
    || (lastWord && INCOMPLETE_ENDINGS.has(lastWord))
  );
}

function addTerminalPunctuation(text) {
  const trimmed = text.trim();
  const closingMarks = trimmed.match(/["')\]]+$/)?.[0] || '';

  if (!closingMarks) {
    return `${trimmed}.`;
  }

  return `${trimmed.slice(0, -closingMarks.length)}.${closingMarks}`;
}

function polishChatReply(text) {
  if (!text || !text.trim()) {
    return '';
  }

  const trimmed = text.trim();

  if (!hasTerminalPunctuation(trimmed) && !endsWithHardFragment(trimmed)) {
    return addTerminalPunctuation(trimmed);
  }

  return trimmed;
}

function isIncompleteReply(text) {
  if (!text || !text.trim()) {
    return true;
  }

  const trimmed = text.trim();
  const words = getReplyWords(trimmed);
  const lastWord = words.at(-1)?.toLowerCase();

  return (
    trimmed.endsWith('...')
    || /[,;:([\-"\u201c]$/.test(trimmed)
    || hasUnclosedQuote(trimmed)
    || !hasTerminalPunctuation(trimmed)
    || (lastWord && INCOMPLETE_ENDINGS.has(lastWord))
  );
}

function getJournalText(journal) {
  return (journal?.fullText || journal?.content || '').replace(/\s+/g, ' ').trim();
}

function getQuestionKeywords(question) {
  const ignoredWords = new Set([
    'about',
    'again',
    'does',
    'have',
    'please',
    'short',
    'tell',
    'what',
    'when',
    'where',
    'which',
    'with',
    'would',
    'your',
  ]);

  return (question.toLowerCase().match(/[a-z0-9']{4,}/g) || [])
    .filter((word) => !ignoredWords.has(word));
}

function cleanSnippet(snippet) {
  return snippet
    .replace(/\s+/g, ' ')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .trim();
}

function getSnippetAroundKeyword(text, keyword) {
  const lowerText = text.toLowerCase();
  const keywordIndex = lowerText.indexOf(keyword);

  if (keywordIndex === -1) {
    return '';
  }

  const sentenceStart = Math.max(
    text.lastIndexOf('.', keywordIndex),
    text.lastIndexOf('!', keywordIndex),
    text.lastIndexOf('?', keywordIndex),
    text.lastIndexOf('\n', keywordIndex),
  );
  const nextStops = ['.', '!', '?', '\n']
    .map((mark) => text.indexOf(mark, keywordIndex + keyword.length))
    .filter((index) => index !== -1);
  const sentenceEnd = nextStops.length > 0 ? Math.min(...nextStops) + 1 : -1;

  const start = sentenceStart === -1 ? Math.max(0, keywordIndex - 70) : sentenceStart + 1;
  const end = sentenceEnd === -1 ? Math.min(text.length, keywordIndex + keyword.length + 120) : sentenceEnd;

  return cleanSnippet(text.slice(start, end));
}

function extractRelevantSnippet(question, similarJournals) {
  const keywords = getQuestionKeywords(question);

  for (const journal of similarJournals) {
    const text = getJournalText(journal);

    for (const keyword of keywords) {
      const snippet = getSnippetAroundKeyword(text, keyword);

      if (snippet) {
        return snippet;
      }
    }
  }

  const firstJournalText = getJournalText(similarJournals[0]);

  if (!firstJournalText) {
    return '';
  }

  return cleanSnippet(firstJournalText.slice(0, 180));
}

function isYesNoQuestion(question) {
  return /^(am|are|can|could|did|do|does|had|has|have|is|should|was|were|will|would)\b/i.test(question.trim());
}

function buildJournalContextFallbackAnswer(question, similarJournals) {
  const snippet = extractRelevantSnippet(question, similarJournals);

  if (!snippet) {
    return 'I do not have enough journal context to answer that clearly yet. In short, write one line about what feels heavy, and I can help you unpack it.';
  }

  const snippetSentence = addTerminalPunctuation(snippet.replace(/[.!?]+$/g, ''));

  if (/\b(burden|heavy|carry|carrying|responsibility|responsible)\b/i.test(question)) {
    return `Yes, your journal does point to a burden. The relevant part is: ${snippetSentence} In short, it sounds like something feels emotionally heavy, and it may help to name what is actually yours to carry.`;
  }

  if (isYesNoQuestion(question)) {
    return `Yes, your journal has related context. The relevant part is: ${snippetSentence} In short, there seems to be a connection, but you can decide how strongly it fits.`;
  }

  return `Your journal has related context. The relevant part is: ${snippetSentence} In short, that is the clearest connection I found.`;
}

function buildChatRetryPrompt(question, similarJournals, incompleteAnswer) {
  const originalPrompt = buildChatPrompt(question, similarJournals);

  return [
    originalPrompt,
    '',
    'The previous answer was incomplete or cut off:',
    incompleteAnswer || '(empty response)',
    '',
    'Rewrite the answer from scratch. Return only a complete, polished answer.',
    'Do not end mid-sentence, do not leave a quote open, and end with proper punctuation.',
    'Keep it under 90 words.',
  ].join('\n');
}

async function generateLLMResponse(prompt, overrides = {}) {
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
          ...overrides,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`);
      return 'I\'m having trouble connecting to my knowledge base right now. Please try again later.';
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map((part) => part.text || '').join('').trim();
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

    let answer = polishChatReply(await generateLLMResponse(prompt, { maxOutputTokens: 320 }));
    let attempts = 1;

    while (isIncompleteReply(answer) && attempts < MAX_CHAT_GENERATION_ATTEMPTS) {
      const retryPrompt = buildChatRetryPrompt(question.trim(), similarJournals, answer);
      answer = polishChatReply(await generateLLMResponse(retryPrompt, {
        maxOutputTokens: 360,
        temperature: 0.35,
      }));
      attempts += 1;
    }

    if (isIncompleteReply(answer)) {
      answer = buildJournalContextFallbackAnswer(question.trim(), similarJournals);
    }

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
  buildJournalContextFallbackAnswer,
  isIncompleteReply,
  polishChatReply,
};
