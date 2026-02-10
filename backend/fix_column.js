const { sequelize } = require('./src/utils/db');

async function fixSchema() {
    try {
        console.log('Checking for showInShop column...');
        const [results] = await sequelize.query("SHOW COLUMNS FROM ManukatoItems LIKE 'showInShop'");

        if (results.length === 0) {
            console.log('Adding showInShop column...');
            await sequelize.query("ALTER TABLE ManukatoItems ADD COLUMN showInShop BOOLEAN DEFAULT true");
            console.log('✅ Column added successfully.');
        } else {
            console.log('✅ Column already exists.');
        }
    } catch (error) {
        console.error('❌ Error fixing schema:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

fixSchema();
