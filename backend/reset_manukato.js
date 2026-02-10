const { ManukatoItem } = require('./src/models');
const { sequelize } = require('./src/utils/db');

async function resetManukatoItems() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Database connection OK.');

        console.log('Clearing ManukatoItems table...');
        // Truncate the table to remove all entries and reset auto-increment if possible
        await ManukatoItem.destroy({ where: {}, truncate: true });

        console.log('✅ ManukatoItems table cleared.');
        console.log('Restart the backend server to re-scan the folder and populate with new filenames.');
    } catch (error) {
        console.error('❌ Error resetting table:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

resetManukatoItems();
