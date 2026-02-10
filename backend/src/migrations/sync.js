const { sequelize } = require('../utils/db');
const {
    User,
    Category,
    Product,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    JournalEntry,
    JournalResponse,
    ManukatoItem
} = require('../models');

const syncDatabase = async () => {
    try {
        // Force true will drop and recreate tables - use with CAUTION in production
        // For development V1, we use force: true to ensure clean schema
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully (all tables recreated).');
        process.exit(0);
    } catch (error) {
        console.error('Error synchronizing database:', error);
        process.exit(1);
    }
};

syncDatabase();
