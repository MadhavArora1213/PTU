const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_i8e5kVIEBqDv@ep-round-resonance-a11eisog-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\'', (err, res) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Users table columns:');
    res.rows.forEach(row => console.log(row.column_name, row.data_type));
  }
  pool.end();
});