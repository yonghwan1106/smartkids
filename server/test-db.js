require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL);
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Check existing tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Existing tables:');
    if (result.rows.length === 0) {
      console.log('No tables found in the database');
    } else {
      result.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    // Check users table structure if exists
    try {
      const usersStructure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      if (usersStructure.rows.length > 0) {
        console.log('\n👥 Users table structure:');
        usersStructure.rows.forEach(row => {
          console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });
      }
    } catch (err) {
      console.log('\n❌ Users table does not exist');
    }
    
    // Check children table structure if exists
    try {
      const childrenStructure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'children' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
      
      if (childrenStructure.rows.length > 0) {
        console.log('\n👶 Children table structure:');
        childrenStructure.rows.forEach(row => {
          console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });
      }
    } catch (err) {
      console.log('\n❌ Children table does not exist');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();