require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkUser() {
  try {
    const client = await pool.connect();
    
    // Check if user exists
    const result = await client.query('SELECT id, name, email, created_at FROM users WHERE email = $1', ['sanoramyun8@gmail.com']);
    
    if (result.rows.length > 0) {
      console.log('✅ User found in database:');
      console.log(result.rows[0]);
    } else {
      console.log('❌ User not found in database');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error checking user:', error.message);
  } finally {
    await pool.end();
  }
}

checkUser();