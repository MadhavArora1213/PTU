const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const db = require('../config/database');
const { generateTokens } = require('../middleware/auth');

dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, userType, language } = req.body;

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await db.query(
      'INSERT INTO users (name, email, password, phone, user_type, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, user_type, language',
      [name, email, hashedPassword, phone, userType, language || 'en']
    );

    const user = result.rows[0];
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    // Store refresh token in database
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
      [user.id, refreshToken]
    );
    
    // Initialize user points
    await db.query(
      'INSERT INTO user_points (user_id, total_points) VALUES ($1, 0)',
      [user.id]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    // Store refresh token in database (replace existing)
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\') ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL \'7 days\'',
      [user.id, refreshToken]
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user_type: user.user_type,
        language: user.language
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

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
};