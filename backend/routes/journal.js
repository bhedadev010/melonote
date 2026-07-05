const express = require('express');
const protect = require('../middleware/auth');
const { sparkIdea, createEntry, getEntries, getEntry, updateEntry, deleteEntry, chat } = require('../controllers/journalController');

const router = express.Router();

router.post('/spark-idea', protect, sparkIdea);
router.post('/entries', protect, createEntry);
router.get('/entries', protect, getEntries);
router.get('/entries/:id', protect, getEntry);
router.put('/entries/:id', protect, updateEntry);
router.delete('/entries/:id', protect, deleteEntry);
router.post('/chat', protect, chat);

module.exports = router;
