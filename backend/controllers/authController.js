const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const db = require('../config/database');
const { generateTokens } = require('../middleware/auth');
const { sendOTP, verifyOTP, sendWelcomeEmail } = require('../services/emailService');
const { translateText } = require('../services/translationService');

dotenv.config();

// Track login attempts
const trackLoginAttempt = async (email, ipAddress, userAgent, success) => {
  try {
    await db.query(
      'INSERT INTO login_attempts (email, ip_address, user_agent, success) VALUES ($1, $2, $3, $4)',
      [email, ipAddress, userAgent, success]
    );
  } catch (error) {
    console.error('Error tracking login attempt:', error);
  }
};

// Check if account is locked
const isAccountLocked = async (email) => {
  try {
    const result = await db.query(
      'SELECT failed_login_attempts, account_locked_until FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) return false;
    
    const user = result.rows[0];
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || 10);
    const lockTime = parseInt(process.env.ACCOUNT_LOCK_TIME || 15); // minutes
    
    // Check if account is currently locked
    if (user.account_locked_until && new Date() < new Date(user.account_locked_until)) {
      return true;
    }
    
    // Reset lock if time has passed
    if (user.account_locked_until && new Date() >= new Date(user.account_locked_until)) {
      await db.query(
        'UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL WHERE email = $1',
        [email]
      );
      return false;
    }
    
    return user.failed_login_attempts >= maxAttempts;
  } catch (error) {
    console.error('Error checking account lock:', error);
    return false;
  }
};

// Update failed login attempts
const updateFailedAttempts = async (email, success) => {
  try {
    if (success) {
      // Reset failed attempts on successful login
      await db.query(
        'UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL WHERE email = $1',
        [email]
      );
    } else {
      // Increment failed attempts
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || 10);
      const lockTime = parseInt(process.env.ACCOUNT_LOCK_TIME || 15); // minutes
      
      const result = await db.query(
        'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE email = $1 RETURNING failed_login_attempts',
        [email]
      );
      
      if (result.rows.length > 0 && result.rows[0].failed_login_attempts >= maxAttempts) {
        // Lock account
        const lockUntil = new Date(Date.now() + lockTime * 60 * 1000);
        await db.query(
          'UPDATE users SET account_locked_until = $1 WHERE email = $2',
          [lockUntil, email]
        );
      }
    }
  } catch (error) {
    console.error('Error updating failed attempts:', error);
  }
};

// Send OTP for registration
const sendRegistrationOTP = async (req, res) => {
  try {
    const { email, language } = req.body;

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'A user with this email already exists. Please use a different email or login with your existing account.'
      });
    }

    // Send OTP
    const result = await sendOTP(email, language || 'en');
    
    if (result.success) {
      const response = {
        message: result.message,
        messageId: result.messageId
      };
      
      // In development mode, include additional info
      if (result.developmentMode) {
        response.developmentMode = true;
        response.note = 'Email service unavailable. OTP logged to console.';
        // Don't send actual OTP to frontend for security
      }
      
      res.status(200).json(response);
    } else {
      res.status(500).json({
        message: result.message || 'Failed to send OTP'
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

// Verify OTP and complete registration
const registerUser = async (req, res) => {
  console.log('Registration endpoint hit');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, phone, userType, language, otp } = req.body;

    // Validate required fields
    if (!name || !email || !password || !otp) {
      console.log('Missing required fields for registration');
      return res.status(400).json({ message: 'Name, email, password, and OTP are required' });
    }

    // Verify OTP first
    const otpResult = await verifyOTP(email, otp);
    if (!otpResult.success) {
      return res.status(400).json({ message: otpResult.message });
    }

    // Check if user already exists (double check)
    console.log('Checking if user exists with email:', email);
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    console.log('Existing user query result:', existingUser.rows);

    if (existingUser.rows.length > 0) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'A user with this email already exists. Please use a different email or login with your existing account.' });
    }

    // Hash password
    console.log('Hashing password');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    // Insert new user with email verified
    console.log('Inserting new user into database');
    const result = await db.query(
      'INSERT INTO users (name, email, password, phone, user_type, language, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, phone, user_type, language, email_verified',
      [name, email, hashedPassword, phone, userType, language || 'en', true]
    );
    console.log('User inserted successfully:', result.rows[0]);

    const user = result.rows[0];
    
    // Generate tokens
    console.log('Generating tokens for user:', user.id);
    const { accessToken, refreshToken } = generateTokens(user);
    console.log('Tokens generated successfully');
    
    // Store refresh token in database
    console.log('Storing refresh token in database');
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
      [user.id, refreshToken]
    );
    console.log('Refresh token stored successfully');
    
    // Initialize user points
    console.log('Initializing user points');
    await db.query(
      'INSERT INTO user_points (user_id, total_points) VALUES ($1, 0)',
      [user.id]
    );
    console.log('User points initialized successfully');

    // Initialize user avatar
    console.log('Initializing user avatar');
    await db.query(
      'INSERT INTO user_avatars (user_id, avatar_type) VALUES ($1, $2)',
      [user.id, 'default']
    );
    console.log('User avatar initialized successfully');

    // Send welcome email (don't block registration if email fails)
    console.log('Sending welcome email');
    try {
      const welcomeEmailResult = await sendWelcomeEmail(user.email, user.name, language || 'en');
      console.log('Welcome email result:', welcomeEmailResult);
    } catch (emailError) {
      console.error('Welcome email failed (non-blocking):', emailError);
      // Continue with registration even if welcome email fails
    }

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    if (error.code) {
      console.error('Database error code:', error.code);
    }
    if (error.detail) {
      console.error('Database error detail:', error.detail);
    }
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Check if account is locked
    const locked = await isAccountLocked(email);
    if (locked) {
      await trackLoginAttempt(email, ipAddress, userAgent, false);
      return res.status(423).json({
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if user exists
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      await trackLoginAttempt(email, ipAddress, userAgent, false);
      await updateFailedAttempts(email, false);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(400).json({
        message: 'Please verify your email before logging in. Check your inbox for the verification code.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await trackLoginAttempt(email, ipAddress, userAgent, false);
      await updateFailedAttempts(email, false);
      
      // Get remaining attempts
      const userResult = await db.query(
        'SELECT failed_login_attempts FROM users WHERE email = $1',
        [email]
      );
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || 10);
      const remainingAttempts = maxAttempts - (userResult.rows[0]?.failed_login_attempts || 0);
      
      return res.status(400).json({
        message: `Invalid credentials. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : 'Account will be locked.'}`
      });
    }

    // Successful login - track and reset failed attempts
    await trackLoginAttempt(email, ipAddress, userAgent, true);
    await updateFailedAttempts(email, true);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Replace existing refresh token for this user
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id]);
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
      [user.id, refreshToken]
    );

    // Get user avatar
    const avatarResult = await db.query(
      'SELECT avatar_url, avatar_type FROM user_avatars WHERE user_id = $1',
      [user.id]
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user_type: user.user_type,
        language: user.language,
        email_verified: user.email_verified,
        avatar: avatarResult.rows[0] || { avatar_type: 'default', avatar_url: null }
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }
  
  try {
    // Check if refresh token exists in database
    const result = await db.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    // Get user details
    const userResult = await db.query(
      'SELECT id, email FROM users WHERE id = $1',
      [result.rows[0].user_id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    
    // Update refresh token in database
    await db.query(
      'UPDATE refresh_tokens SET token = $1, expires_at = NOW() + INTERVAL \'7 days\' WHERE user_id = $2',
      [newRefreshToken, user.id]
    );
    
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Remove refresh token from database
      await db.query(
        'DELETE FROM refresh_tokens WHERE token = $1',
        [refreshToken]
      );
    }
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// Get UI translations for user's language
const getTranslations = async (req, res) => {
  try {
    const { language } = req.query;
    const { getUITranslations } = require('../services/translationService');
    
    const result = await getUITranslations(language || 'en');
    
    if (result.success) {
      res.json({
        success: true,
        language: language || 'en',
        translations: result.translations
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || 'Failed to get translations'
      });
    }
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting translations'
    });
  }
};

// Update user language preference
const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Validate language
    const { supportedLanguages } = require('../services/translationService');
    if (!supportedLanguages[language]) {
      return res.status(400).json({
        message: 'Unsupported language'
      });
    }
    
    // Update user language in database
    await db.query(
      'UPDATE users SET language = $1 WHERE id = $2',
      [language, userId]
    );
    
    // Get translations for the new language
    const { getUITranslations } = require('../services/translationService');
    const translations = await getUITranslations(language);
    
    res.json({
      message: 'Language updated successfully',
      language: language,
      translations: translations.translations || {}
    });
  } catch (error) {
    console.error('Language update error:', error);
    res.status(500).json({
      message: 'Server error while updating language'
    });
  }
};

module.exports = {
  sendRegistrationOTP,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getTranslations,
  updateLanguage
};