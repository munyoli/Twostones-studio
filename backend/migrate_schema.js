const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected!\n');

        // Get all foreign keys for CartItems
        console.log('Finding foreign keys on CartItems...');
        const [cartFKs] = await connection.query(`
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'CartItems' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `, [process.env.DB_NAME]);

        for (const fk of cartFKs) {
            console.log(`  Dropping ${fk.CONSTRAINT_NAME}...`);
            await connection.query(`ALTER TABLE CartItems DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`);
        }

        // Alter CartItems
        console.log('\nAltering CartItems.product_id to VARCHAR(50)...');
        await connection.query('ALTER TABLE CartItems MODIFY COLUMN product_id VARCHAR(50) NOT NULL');
        console.log('✅ CartItems updated');

        // Get all foreign keys for OrderItems
        console.log('\nFinding foreign keys on OrderItems...');
        const [orderFKs] = await connection.query(`
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'OrderItems' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `, [process.env.DB_NAME]);

        for (const fk of orderFKs) {
            console.log(`  Dropping ${fk.CONSTRAINT_NAME}...`);
            await connection.query(`ALTER TABLE OrderItems DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`);
        }

        // Alter OrderItems
        console.log('\nAltering OrderItems.product_id to VARCHAR(50)...');
        await connection.query('ALTER TABLE OrderItems MODIFY COLUMN product_id VARCHAR(50) NOT NULL');
        console.log('✅ OrderItems updated');

        console.log('\n🎉 Migration complete!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

migrate();
