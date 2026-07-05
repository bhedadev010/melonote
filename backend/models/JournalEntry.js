const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    trim: true,
    default: 'Untitled entry',
  },
  content: {
    type: String,
    required: [true, 'Entry content is required'],
    trim: true,
  },
  fullText: {
    type: String,
    trim: true,
  },
  emotions: {
    type: [
      {
        label: { type: String, trim: true },
        score: { type: Number, min: 0, max: 1 },
      },
    ],
    default: [],
  },
  embedding: {
    type: [Number],
  },
  messages: {
    type: [
      {
        role: { type: String, enum: ['user', 'assistant'] },
        content: { type: String, required: true },
      },
    ],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
