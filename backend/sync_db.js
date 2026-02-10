const { sequelize } = require('./src/utils/db');
require('./src/models');

async function syncDb() {
    try {
        console.log('Syncing database schema...');
        await sequelize.sync({ alter: true });
        console.log('✅ Database schema updated successfully.');
    } catch (error) {
        console.error('❌ Error syncing database:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

syncDb();
