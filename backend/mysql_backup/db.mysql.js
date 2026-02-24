const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

// --- 1. Sequelize Configuration (for Models) ---
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS || process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// --- 2. mysql2/promise Pool Configuration (for Raw Queries) ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- 3. Connection Test ---
const testConnection = async () => {
    try {
        // Test Sequelize
        console.log(`Attempting to connect to ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}...`);
        await sequelize.authenticate();
        console.log('Sequelize connected to MySQL.');

        // Test mysql2 Pool
        const [rows] = await pool.query('SELECT 1 as test');
        if (rows[0].test === 1) {
            console.log('mysql2/promise pool connected to MySQL.');
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
        // We don't exit process immediately because pool might keep it open
        // but for a quick test run it's fine.
        setTimeout(() => process.exit(0), 1000);
    });
}
