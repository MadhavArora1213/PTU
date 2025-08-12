const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Neon PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

// Log database connection details for debugging
console.log('Database connection string:', process.env.DATABASE_URL?.substring(0, 50) + '...'); // Log first 50 chars for security

// Function to initialize database tables
const initializeDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(20) CHECK (user_type IN ('student', 'salaried', 'business')),
        language VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Financial goals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS financial_goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        goal_type VARCHAR(50) NOT NULL,
        target_amount DECIMAL(15,2),
        current_amount DECIMAL(15,2) DEFAULT 0,
        target_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Budget plans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS budget_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        month INTEGER,
        year INTEGER,
        income DECIMAL(15,2),
        expenses DECIMAL(15,2),
        savings DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Budget categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS budget_categories (
        id SERIAL PRIMARY KEY,
        plan_id INTEGER REFERENCES budget_plans(id),
        category_name VARCHAR(100),
        allocated_amount DECIMAL(15,2),
        spent_amount DECIMAL(15,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Quiz results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        quiz_topic VARCHAR(100),
        score INTEGER,
        total_questions INTEGER,
        badges_earned VARCHAR(100)[],
        points_earned INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fraud reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fraud_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(200),
        description TEXT,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        image_url VARCHAR(500),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
        reward_points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Financial tips table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS financial_tips (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200),
        content TEXT,
        language VARCHAR(10) DEFAULT 'en',
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User achievements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        achievement_name VARCHAR(100),
        description TEXT,
        points INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User points table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_points (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_points INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Refresh tokens table for auth
    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Ensure one refresh token per user for UPSERTs
        await pool.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
          ON refresh_tokens (user_id)
        `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Error stack:', error.stack);
  }
};

// Test database connection and log details
const testDatabaseConnection = async () => {
  try {
    const result = await pool.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('Users table exists');
      
      // Check columns in users table
      const columnCheck = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);
      
      console.log('Users table columns:');
      columnCheck.rows.forEach(row => {
        console.log(`  ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('Users table does not exist');
    }
  } catch (error) {
    console.error('Database test error:', error);
  }
};

// Run test after a short delay to ensure server is up
setTimeout(testDatabaseConnection, 2000);

module.exports = {
  query: (text, params) => pool.query(text, params),
  initializeDatabase
};