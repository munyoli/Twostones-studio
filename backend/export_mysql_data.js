const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const EXPORT_DIR = path.join(__dirname, 'mysql_data_export');

const TABLES = [
    'Users',
    'Categories',
    'Products',
    'ProductImages',
    'Carts',
    'CartItems',
    'Orders',
    'OrderItems',
    'JournalEntries',
    'JournalResponses',
    'ManukatoItems'
];

async function exportData() {
    // Create export directory
    if (!fs.existsSync(EXPORT_DIR)) {
        fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }

    let connection;
    try {
        console.log('Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306', 10)
        });
        console.log('Connected!\n');

        const summary = [];

        for (const table of TABLES) {
            try {
                const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
                const filePath = path.join(EXPORT_DIR, `${table}.json`);
                fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
                console.log(`✅ ${table}: ${rows.length} rows exported`);
                summary.push({ table, rows: rows.length });
            } catch (err) {
                // Table might not exist
                console.log(`⚠️  ${table}: ${err.message}`);
                summary.push({ table, rows: 0, error: err.message });
            }
        }

        // Save summary
        fs.writeFileSync(
            path.join(EXPORT_DIR, '_summary.json'),
            JSON.stringify(summary, null, 2)
        );

        console.log('\n🎉 Export complete! Files saved to:', EXPORT_DIR);
        console.log('\nSummary:');
        console.table(summary);

    } catch (error) {
        console.error('❌ Connection error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

exportData();
