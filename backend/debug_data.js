const { sequelize } = require('./src/utils/db');
const { query } = require('./src/utils/db');

async function debugData() {
    try {
        console.log('--- Cart Items ---');
        const [cartItems] = await sequelize.query("SELECT * FROM CartItems");
        console.log(JSON.stringify(cartItems, null, 2));

        console.log('\n--- Manukato Items ---');
        const [manukatoItems] = await query("SELECT * FROM ManukatoItems");
        console.log(JSON.stringify(manukatoItems, null, 2));

        console.log('\n--- Products (First 5) ---');
        const [products] = await sequelize.query("SELECT * FROM Products LIMIT 5");
        console.log(JSON.stringify(products, null, 2));

    } catch (error) {
        console.error('Error fetching debug data:', error);
    } finally {
        process.exit();
    }
}

debugData();
