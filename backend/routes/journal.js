const express = require('express');
const protect = require('../middleware/auth');
const { sparkIdea } = require('../controllers/journalController');

const router = express.Router();

router.post('/spark-idea', protect, sparkIdea);

module.exports = router;
