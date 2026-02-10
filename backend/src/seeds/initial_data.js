const {
    Category,
    Product,
    ProductImage,
    User,
    JournalEntry
} = require('../models');
const { sequelize } = require('../utils/db');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }); // Ensure clean start for seeds

        // 1. Create Categories
        const categories = await Category.bulkCreate([
            { name: 'Ready-to-Wear', slug: 'ready-to-wear', description: 'Luxury everyday fashion with African heritage.' },
            { name: 'Couture', slug: 'couture', description: 'Exquisite, custom-made high fashion pieces.' },
            { name: 'Accessories', slug: 'accessories', description: 'Traditional-meets-modern accessories.' }
        ]);

        // 2. Create Products
        const products = await Product.bulkCreate([
            {
                name: 'The Deborah Gown',
                description: 'A structural masterpiece inspired by the courage of Deborah. Hand-woven silk with traditional embroidery.',
                price: 1200.00,
                sku: 'TS-RTW-001',
                stock_quantity: 5,
                category_id: categories[0].id
            },
            {
                name: 'Royal Heritage Kaftan',
                description: 'Deep indigo dyed fabric with gold leaf accents. Representing identity and spiritual strength.',
                price: 850.00,
                sku: 'TS-RTW-002',
                stock_quantity: 10,
                category_id: categories[0].id
            },
            {
                name: 'Soul Reflection Wrap',
                description: 'Linen and silk blend wrap, perfect for meditation and mindful movement.',
                price: 350.00,
                sku: 'TS-ACC-001',
                stock_quantity: 20,
                category_id: categories[2].id
            }
        ]);

        // 3. Create Images
        await ProductImage.bulkCreate([
            { product_id: products[0].id, image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', is_primary: true },
            { product_id: products[1].id, image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985', is_primary: true },
            { product_id: products[2].id, image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', is_primary: true }
        ]);

        // 4. Create Journal Entries
        await JournalEntry.bulkCreate([
            {
                title: 'The Courage of Deborah',
                encounter_text: 'Judges 4:4-9. Deborah, a prophetess, was leading Israel. She summoned Barak and gave him a command from the Lord.',
                identity_text: 'You are called to lead and inspire.',
                lie_text: 'I am too weak to make a difference.',
                consequence_text: 'Living in fear and missing the divine victory.',
                redemption_text: 'Strength is made perfect in weakness.',
                is_free: true,
                garment_id: products[0].id
            },
            {
                title: 'Esther: Appointment for a Time',
                encounter_text: 'Esther 4:14-16. "And who knows but that you have come to your royal position for such a time as this?"',
                identity_text: 'You have a royal purpose.',
                lie_text: 'I am just a passenger in my own life.',
                consequence_text: 'Silencing your voice when it matters most.',
                redemption_text: 'Stepping into the light with fasting and faith.',
                is_free: false,
                garment_id: products[1].id
            }
        ]);

        // 5. Create Admin User
        await User.create({
            name: 'Admin User',
            email: 'admin@twostones.com',
            password: 'adminpassword123', // In real app, this MUST be hashed
            role: 'admin'
        });

        // 6. Create Sample Customer with Measurements
        await User.create({
            name: 'Sarah Blake',
            email: 'sarah@example.com',
            password: 'customerpassword123',
            role: 'customer',
            measurements: {
                bust: '34"',
                waist: '26"',
                hips: '36"',
                shoulder: '15"',
                length: '58"',
                notes: 'Prefers slightly loose fit around the waist.'
            }
        });

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
