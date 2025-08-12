const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUserPoints,
  getUserAchievements
} = require('../controllers/userController');

// Get user profile
router.get('/profile', authenticateToken, getUserProfile);

// Update user profile
router.put('/profile', authenticateToken, updateUserProfile);

// Get user points
router.get('/points', authenticateToken, getUserPoints);

// Get user achievements
router.get('/achievements', authenticateToken, getUserAchievements);

module.exports = router;