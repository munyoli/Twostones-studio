const { sequelize } = require('./src/utils/db');

async function migrate() {
    try {
        console.log('Starting migration: Change CartItem.product_id to VARCHAR...');

        // Alter the CartItems table to change product_id from INT to VARCHAR
        await sequelize.query(`
            ALTER TABLE CartItems 
            MODIFY COLUMN product_id VARCHAR(50) NOT NULL;
        `);

        console.log('✅ Migration complete: CartItem.product_id is now VARCHAR(50)');

        // Also update OrderItems to support Manukato items
        await sequelize.query(`
            ALTER TABLE OrderItems 
            MODIFY COLUMN product_id VARCHAR(50) NOT NULL;
        `);

        console.log('✅ Migration complete: OrderItem.product_id is now VARCHAR(50)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
