const fs = require('fs');
const path = require('path');
const { pool } = require('../utils/db');

async function runSchema() {
    try {
        console.log('Running supabase_schema.sql...');
        const schemaPath = path.join(__dirname, '../../../supabase_schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(sql);
        console.log('Schema executed successfully!');
    } catch (error) {
        console.error('Error executing schema:', error);
    } finally {
        process.exit();
    }
}

runSchema();
