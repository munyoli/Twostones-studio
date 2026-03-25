const { pool } = require('../utils/db');

async function createTable() {
    try {
        console.log('Creating page_visits table in Supabase...');
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            CREATE TABLE IF NOT EXISTS page_visits (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                path TEXT NOT NULL,
                referrer TEXT,
                "userAgent" TEXT,
                timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        console.log('Table created successfully!');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        process.exit();
    }
}

createTable();
