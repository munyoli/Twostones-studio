const { sequelize } = require('./src/utils/db');
const { ManukatoItem } = require('./src/models');

async function repair() {
    try {
        console.log('--- REPAIR START ---');

        // 1. Check schema
        console.log('Checking columns...');
        const [results] = await sequelize.query("SHOW COLUMNS FROM ManukatoItems LIKE 'showInShop'");

        if (results.length === 0) {
            console.log('Column "showInShop" missing. Adding it now...');
            await sequelize.query("ALTER TABLE ManukatoItems ADD COLUMN showInShop BOOLEAN DEFAULT true");
            console.log('✅ Column added.');
        } else {
            console.log('✅ Column "showInShop" already exists.');
        }

        // 2. Clear table to force re-scan with correct price/visibility
        console.log('Resetting ManukatoItems data...');
        await ManukatoItem.destroy({ where: {}, truncate: true });
        console.log('✅ Data reset.');

        console.log('--- REPAIR COMPLETE ---');
    } catch (error) {
        console.error('❌ REPAIR FAILED:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

repair();
