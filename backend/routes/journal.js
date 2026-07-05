const express = require('express');
const protect = require('../middleware/auth');
const { sparkIdea, createEntry, getEntries } = require('../controllers/journalController');

const router = express.Router();

router.post('/spark-idea', protect, sparkIdea);
router.post('/entries', protect, createEntry);
router.get('/entries', protect, getEntries);

module.exports = router;
