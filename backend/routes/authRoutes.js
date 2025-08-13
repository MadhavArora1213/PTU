const express = require('express');
const router = express.Router();
const { 
  sendRegistrationOTP, 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser,
  getTranslations,
  updateLanguage
} = require('../controllers/authController');
const { 
  sanitizeInput,
  validateRegistration,
  validateLogin,
  validateOTP,
  validateEmailForOTP,
  handleValidationErrors,
  loginRateLimit,
  otpRateLimit,
  registrationRateLimit
} = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Send OTP for registration
router.post('/send-otp', 
  otpRateLimit,
  sanitizeInput,
  validateEmailForOTP,
  handleValidationErrors,
  sendRegistrationOTP
);

// Register a new user with OTP verification
router.post('/register', 
  registrationRateLimit,
  sanitizeInput,
  validateRegistration,
  handleValidationErrors,
  registerUser
);

// Login user with rate limiting and validation
router.post('/login', 
  loginRateLimit,
  sanitizeInput,
  validateLogin,
  handleValidationErrors,
  loginUser
);

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

// Get translations for UI
router.get('/translations', getTranslations);

// Update user language (requires authentication)
router.put('/language', 
  authenticateToken,
  sanitizeInput,
  updateLanguage
);

module.exports = router;