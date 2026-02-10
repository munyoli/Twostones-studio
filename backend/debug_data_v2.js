const { sequelize } = require('./src/utils/db');
const { query } = require('./src/utils/db');

async function debugData() {
    try {
        console.log('--- Cart Items ---');
        const [cartItems] = await sequelize.query("SELECT id, cart_id, product_id, quantity FROM CartItems");
        console.table(cartItems);

        console.log('\n--- Manukato Items ---');
        const [manukatoItems] = await query("SELECT id, brandName, price FROM ManukatoItems");
        console.table(manukatoItems);

        console.log('\n--- Products (First 5) ---');
        const [products] = await sequelize.query("SELECT id, name, price FROM Products LIMIT 5");
        console.table(products);

    } catch (error) {
        console.error('Error fetching debug data:', error);
    } finally {
        process.exit();
    }
}

debugData();
