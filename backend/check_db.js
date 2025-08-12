const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Use the DATABASE_URL from .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
    
    // Check all users in the database
    pool.query('SELECT id, name, email, user_type, language, created_at FROM users ORDER BY created_at DESC', (err, res) => {
      if (err) {
        console.error('Error fetching users:', err);
      } else {
        console.log('Users in database:');
        res.rows.forEach(row => {
          console.log(`  ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Type: ${row.user_type}, Language: ${row.language}, Created: ${row.created_at}`);
        });
      }
      pool.end();
    });
  }
});