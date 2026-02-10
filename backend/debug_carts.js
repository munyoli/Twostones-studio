console.log('Starting DB Inspection...');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { User, Cart, CartItem, sequelize } = require('./src/models');

async function inspectDB() {
    try {
        console.log('Connecting to DB...');
        await sequelize.authenticate();
        console.log('DB Connected.');

        console.log('--- Users ---');
        const users = await User.findAll({ attributes: ['id', 'email', 'name', 'role'] });
        console.table(users.map(u => u.toJSON()));

        console.log('\n--- Active Carts ---');
        const carts = await Cart.findAll({
            where: { status: 'active' },
            include: [{ model: CartItem, as: 'items' }]
        });

        const cartData = carts.map(c => ({
            cartId: c.id,
            userId: c.user_id,
            status: c.status,
            itemCount: c.items.length
        }));
        console.table(cartData);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

inspectDB();
