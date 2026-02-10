const { Cart, CartItem, Product, ProductImage, ManukatoItem } = require('../models');

const getCart = async (req, res) => {
    try {
        console.log('[Cart] Fetching cart for user:', req.user.id);

        let cart = await Cart.findOne({
            where: { user_id: req.user.id, status: 'active' },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product', include: [{ model: ProductImage, as: 'images' }] }]
                }
            ]
        });

        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id, status: 'active' });
            cart.items = [];
        }

        // Fetch Manukato items separately for cart items with 'm-' prefix
        const itemsWithManukato = await Promise.all(cart.items.map(async (item) => {
            const itemJson = item.toJSON();

            if (typeof item.product_id === 'string' && item.product_id.startsWith('m-')) {
                const manukatoId = parseInt(item.product_id.substring(2));

                try {
                    const manukatoItem = await ManukatoItem.findByPk(manukatoId);

                    if (manukatoItem) {
                        const enrichedItem = {
                            ...itemJson,
                            product: {
                                id: item.product_id,
                                name: manukatoItem.brandName || 'Manukato Garment',
                                price: parseFloat(manukatoItem.price || 0),
                                images: [{ image_url: manukatoItem.imagePath, is_primary: true }]
                            }
                        };
                        console.log('[Cart] Enriched Manukato item:', enrichedItem.product.name);
                        return enrichedItem;
                    } else {
                        console.warn(`[Cart] Manukato item not found: ${manukatoId}`);
                    }
                } catch (err) {
                    console.error(`[Cart] Error fetching Manukato item ${manukatoId}:`, err);
                }

                // Fallback for missing Manukato items
                return {
                    ...itemJson,
                    product: {
                        id: item.product_id,
                        name: 'Item Unavailable',
                        price: 0,
                        images: [{ image_url: 'https://via.placeholder.com/400?text=Unavailable', is_primary: true }]
                    }
                };
            }

            // For regular products, ensure price is a number
            if (itemJson.product) {
                itemJson.product.price = parseFloat(itemJson.product.price || 0);
            }

            return itemJson;
        }));

        const cartJson = cart.toJSON();
        cartJson.items = itemsWithManukato;
        console.log('[Cart] Final cart response:', JSON.stringify(cartJson, null, 2));
        res.json(cartJson);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        console.log('[Add to Cart] User:', req.user.id, 'Product:', productId, 'Qty:', quantity);

        // Check if it's a Manukato item (ID starts with 'm-')
        const isManukato = typeof productId === 'string' && productId.startsWith('m-');

        if (isManukato) {
            // Validate Manukato item exists
            const manukatoId = parseInt(productId.substring(2));
            const manukatoItem = await ManukatoItem.findByPk(manukatoId);

            if (!manukatoItem) {
                return res.status(404).json({ message: 'Manukato item not found' });
            }
        } else {
            // Validate regular product exists
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
        }

        let cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id, status: 'active' });
            console.log('[Add to Cart] Created new cart:', cart.id);
        }

        let cartItem = await CartItem.findOne({
            where: { cart_id: cart.id, product_id: productId }
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
            console.log('[Add to Cart] Updated existing item:', cartItem.id);
        } else {
            cartItem = await CartItem.create({
                cart_id: cart.id,
                product_id: productId,
                quantity
            });
            console.log('[Add to Cart] Created new item:', cartItem.id);
        }

        res.status(201).json(cartItem);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(400).json({ message: error.message || 'Error adding to cart' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        await CartItem.destroy({ where: { id: itemId } });
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item' });
    }
};

module.exports = { getCart, addToCart, removeFromCart };
