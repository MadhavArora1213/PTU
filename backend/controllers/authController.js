const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const db = require('../config/database');
const { generateTokens } = require('../middleware/auth');

dotenv.config();

const registerUser = async (req, res) => {
console.log('Registration endpoint hit');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, phone, userType, language } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields for registration');
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
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

    // Insert new user
    console.log('Inserting new user into database');
    const result = await db.query(
      'INSERT INTO users (name, email, password, phone, user_type, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, user_type, language',
      [name, email, hashedPassword, phone, userType, language || 'en']
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
    
        // Replace existing refresh token for this user (no ON CONFLICT needed)
        await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id]);
        await db.query(
          'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
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