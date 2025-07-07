require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function restoreAndCreateAccounts() {
  try {
    const client = await pool.connect();
    
    console.log('🔄 계정 설정 중...\n');
    
    // 1. 원래 비밀번호로 복구
    const originalPassword = '22qjsrlf67!';
    const hashedOriginalPassword = await bcrypt.hash(originalPassword, 10);
    
    const updateResult = await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, name, email',
      [hashedOriginalPassword, 'sanoramyun8@gmail.com']
    );
    
    if (updateResult.rows.length > 0) {
      console.log('✅ sanoramyun8@gmail.com 비밀번호가 원래대로 복구되었습니다:');
      console.log(updateResult.rows[0]);
    }
    
    // 2. 테스트 계정 생성 또는 업데이트
    const testPassword = 'test123';
    const hashedTestPassword = await bcrypt.hash(testPassword, 10);
    
    // 먼저 test@test.com 계정이 있는지 확인
    const existingTest = await client.query('SELECT id FROM users WHERE email = $1', ['test@test.com']);
    
    if (existingTest.rows.length > 0) {
      // 이미 있으면 비밀번호만 업데이트
      const updateTestResult = await client.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, name, email',
        [hashedTestPassword, 'test@test.com']
      );
      console.log('\n✅ test@test.com 계정 비밀번호가 업데이트되었습니다:');
      console.log(updateTestResult.rows[0]);
    } else {
      // 없으면 새로 생성
      const createTestResult = await client.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        ['테스트유저', 'test@test.com', hashedTestPassword]
      );
      console.log('\n✅ test@test.com 계정이 새로 생성되었습니다:');
      console.log(createTestResult.rows[0]);
    }
    
    console.log('\n📋 계정 정보:');
    console.log('- sanoramyun8@gmail.com / 22qjsrlf67!');
    console.log('- test@test.com / test123');
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

restoreAndCreateAccounts();