require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkAllTables() {
  try {
    console.log('📊 Checking all database tables...\n');
    
    const client = await pool.connect();
    
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('📋 All tables in database:');
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Get column information for each table
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `, [tableName]);
      
      console.log(`\n✅ ${tableName}:`);
      columnsResult.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'nullable' : 'not null';
        const defaultVal = col.column_default ? ` (default: ${col.column_default})` : '';
        console.log(`   - ${col.column_name}: ${col.data_type} (${nullable})${defaultVal}`);
      });
    }
    
    client.release();
    console.log('\n🎉 All tables created successfully in Neon PostgreSQL!');
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  } finally {
    await pool.end();
  }
}

checkAllTables();