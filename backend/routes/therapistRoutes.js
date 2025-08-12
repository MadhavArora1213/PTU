const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { chatWithTherapist } = require('../controllers/therapistController');

// Chat with financial therapist
router.post('/chat', authenticateToken, chatWithTherapist);

module.exports = router;