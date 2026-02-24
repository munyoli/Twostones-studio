const { Sequelize } = require('sequelize');
const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

// Force IPv4 to avoid connectivity issues on Windows with Supabase IPv6 hosts
dns.setDefaultResultOrder('ipv4first');

// --- 1. Sequelize Configuration (for Models) ---
const sequelize = new Sequelize(
    process.env.SUPABASE_DB_NAME,
    process.env.SUPABASE_DB_USER,
    process.env.SUPABASE_DB_PASSWORD,
    {
        host: process.env.SUPABASE_DB_HOST,
        port: parseInt(process.env.SUPABASE_DB_PORT || '6543', 10),
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

// --- 2. pg Pool Configuration (for Raw Queries) ---
const pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME,
    port: parseInt(process.env.SUPABASE_DB_PORT || '6543', 10),
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// --- 3. Connection Test ---
const testConnection = async () => {
    try {
        console.log(`Attempting to connect to Supabase PostgreSQL at ${process.env.SUPABASE_DB_HOST}...`);
        await sequelize.authenticate();
        console.log('Sequelize connected to Supabase PostgreSQL.');

        // Test Pool
        const res = await pool.query('SELECT 1 as test');
        if (res.rows[0].test === 1) {
            console.log('pg Pool connected to Supabase PostgreSQL.');
        }
    } catch (error) {
        console.error('Database connection error:', error.message);
    }
};

module.exports = {
    sequelize,
    pool,
    testConnection,
    query: (sql, params) => pool.query(sql, params)
};

// Run test if this file is executed directly
if (require.main === module) {
    testConnection().then(() => {
        console.log('Test complete.');
        setTimeout(() => process.exit(0), 1000);
    });
}
