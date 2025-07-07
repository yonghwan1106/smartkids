require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updatePassword() {
  try {
    const client = await pool.connect();
    
    // Hash the new password
    const newPassword = '22qjsrlf67!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    const result = await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, name, email',
      [hashedPassword, 'sanoramyun8@gmail.com']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Password updated successfully for user:');
      console.log(result.rows[0]);
    } else {
      console.log('❌ User not found');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
  } finally {
    await pool.end();
  }
}

updatePassword();