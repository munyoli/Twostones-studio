const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const ProductImage = require('./ProductImage');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const JournalEntry = require('./JournalEntry');
const JournalResponse = require('./JournalResponse');
const ManukatoItem = require('./ManukatoItem');
const PageVisit = require('./PageVisit');
const { sequelize } = require('../utils/db');

// Category - Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product - ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// User - Cart
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart - CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// Product - CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User - Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Product - OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User - JournalResponse
User.hasMany(JournalResponse, { foreignKey: 'user_id' });
JournalResponse.belongsTo(User, { foreignKey: 'user_id' });

// JournalEntry - JournalResponse
JournalEntry.hasMany(JournalResponse, { foreignKey: 'entry_id', as: 'responses' });
JournalResponse.belongsTo(JournalEntry, { foreignKey: 'entry_id', as: 'entry' });

// JournalEntry - Product (Garment)
JournalEntry.belongsTo(Product, { foreignKey: 'garment_id', as: 'garment' });

module.exports = {
    User,
    Product,
    Category,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    JournalEntry,
    JournalResponse,
    ManukatoItem,
    PageVisit,
    sequelize
};
