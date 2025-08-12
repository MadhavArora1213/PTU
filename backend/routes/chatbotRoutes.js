const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { chatWithBot } = require('../controllers/chatbotController');

// Chat with financial advisor bot
router.post('/chat', authenticateToken, chatWithBot);

module.exports = router;