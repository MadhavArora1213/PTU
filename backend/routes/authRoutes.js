const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Refresh access token
router.post('/refresh-token', refreshToken);

// Logout user
router.post('/logout', logoutUser);

// Get user profile (protected route)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = router;