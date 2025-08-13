const { body, validationResult } = require('express-validator');
const xss = require('xss');
const validator = require('validator');

// Regex patterns for validation
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^[+]?[\d\s\-\(\)]{10,15}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  otp: /^\d{6}$/
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize all string inputs
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      // Remove XSS attempts
      req.body[key] = xss(req.body[key]);
      // Trim whitespace
      req.body[key] = req.body[key].trim();
      // Escape HTML entities
      req.body[key] = validator.escape(req.body[key]);
    }
  }
  next();
};

// Registration validation rules
const validateRegistration = [
  body('name')
    .matches(patterns.name)
    .withMessage('Name must contain only letters and spaces, 2-50 characters')
    .customSanitizer(value => validator.escape(value.trim())),
  
  body('email')
    .matches(patterns.email)
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .customSanitizer(value => validator.escape(value.toLowerCase())),
  
  body('password')
    .matches(patterns.password)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  
  body('phone')
    .optional()
    .matches(patterns.phone)
    .withMessage('Please provide a valid phone number')
    .customSanitizer(value => value ? validator.escape(value.trim()) : value),
  
  body('userType')
    .isIn(['student', 'salaried', 'business'])
    .withMessage('User type must be student, salaried, or business'),
  
  body('language')
    .optional()
    .isIn(['en', 'hi', 'pa', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'or'])
    .withMessage('Invalid language selection')
];

// Login validation rules
const validateLogin = [
  body('email')
    .matches(patterns.email)
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .customSanitizer(value => validator.escape(value.toLowerCase())),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
    .customSanitizer(value => value) // Don't escape password as it will be hashed
];

// OTP validation rules
const validateOTP = [
  body('email')
    .matches(patterns.email)
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .customSanitizer(value => validator.escape(value.toLowerCase())),
  
  body('otp')
    .matches(patterns.otp)
    .withMessage('OTP must be exactly 6 digits')
];

// Email validation for OTP request
const validateEmailForOTP = [
  body('email')
    .matches(patterns.email)
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .customSanitizer(value => validator.escape(value.toLowerCase()))
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// Rate limiting for sensitive operations
const createRateLimiter = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limiters
const loginRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per window
  'Too many login attempts, please try again later'
);

const otpRateLimit = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  3, // 3 OTP requests per window
  'Too many OTP requests, please try again later'
);

const registrationRateLimit = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 registration attempts per hour
  'Too many registration attempts, please try again later'
);

module.exports = {
  sanitizeInput,
  validateRegistration,
  validateLogin,
  validateOTP,
  validateEmailForOTP,
  handleValidationErrors,
  loginRateLimit,
  otpRateLimit,
  registrationRateLimit,
  patterns
};