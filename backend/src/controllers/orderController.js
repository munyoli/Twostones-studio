const { Order, OrderItem, Cart, CartItem, Product, sequelize } = require('../models');
const { query } = require('../utils/db');

const checkout = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { shippingAddress, paymentMethod = 'manual', customerEmail, customerPhone } = req.body;

        console.log('[Checkout] User ID:', req.user.id, 'Role:', req.user.role);

        // 1. Get user's active cart
        const cart = await Cart.findOne({
            where: { user_id: req.user.id, status: 'active' },
            include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product', required: false }] }]
        }, { transaction });

        console.log('[Checkout] Cart found:', !!cart, 'Items:', cart?.items?.length || 0);

        if (!cart || cart.items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // 2. Fetch Manukato items and calculate total
        let totalAmount = 0;
        const enrichedItems = await Promise.all(cart.items.map(async (item) => {
            let productData = item.product;

            // If product is null, it's a Manukato item
            if (!productData && typeof item.product_id === 'string' && item.product_id.startsWith('m-')) {
                const manukatoId = parseInt(item.product_id.substring(2));
                const [rows] = await query('SELECT * FROM ManukatoItems WHERE id = ?', [manukatoId]);
                if (rows.length > 0) {
                    productData = {
                        id: item.product_id,
                        name: rows[0].brandName,
                        price: parseFloat(rows[0].price),
                        stock_quantity: 999 // Manukato items don't have stock tracking
                    };
                }
            }

            if (!productData) {
                throw new Error(`Product not found: ${item.product_id}`);
            }

            // Check stock for regular products only
            if (!item.product_id.startsWith('m-') && productData.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${productData.name}`);
            }

            totalAmount += item.quantity * productData.price;

            return {
                ...item.toJSON(),
                product: productData
            };
        }));

        // 3. Create Order
        const order = await Order.create({
            user_id: req.user.id,
            total_amount: totalAmount,
            shipping_address: shippingAddress,
            status: 'pending',
            payment_status: 'unpaid',
            payment_method: paymentMethod,
            customer_email: customerEmail || req.user.email,
            customer_phone: customerPhone
        }, { transaction });

        // 4. Create OrderItems and Deduct Stock
        const orderItems = [];
        for (const item of enrichedItems) {
            const orderItem = await OrderItem.create({
                order_id: order.id,
                product_id: item.product.id,
                quantity: item.quantity,
                price_at_purchase: item.product.price
            }, { transaction });

            // Store with product info for email
            orderItems.push({
                ...orderItem.toJSON(),
                product: item.product
            });

            // Deduct stock for regular products only (not Manukato)
            if (!item.product_id.startsWith('m-')) {
                await Product.decrement('stock_quantity', {
                    where: { id: item.product_id },
                    by: item.quantity,
                    transaction
                });
            }
        }

        // 5. Update Cart status
        cart.status = 'completed';
        await cart.save({ transaction });

        await transaction.commit();

        // 6. Send order confirmation email (async, don't wait)
        const emailService = require('../services/emailService');
        const emailTo = customerEmail || req.user.email;
        emailService.sendOrderConfirmation(order, orderItems, emailTo).catch(err =>
            console.error('Email send failed:', err)
        );

        res.status(201).json({
            message: 'Order placed successfully',
            orderId: order.id,
            total: totalAmount,
            paymentMethod: paymentMethod
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Checkout error:', error);
        console.error('Stack:', error.stack);
        res.status(400).json({ message: error.message || 'Error processing checkout' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

module.exports = { checkout, getMyOrders };
