const fs = require('fs');
const path = require('path');
// Explicitly load .env from backend root
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Current working directory:', process.cwd());
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const { processImage } = require('../utils/imageProcessor');
const { ManukatoItem, ProductImage } = require('../models');
const { sequelize } = require('../utils/db');

const MANUKATO_UPLOAD_DIR = path.join(__dirname, '../public/uploads/manukato');

const migrate = async () => {
    console.log('Starting migration...');

    try {
        console.log('Authenticating database...');
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Migrate Manukato Items
        console.log('Scanning Manukato directory...');
        if (fs.existsSync(MANUKATO_UPLOAD_DIR)) {
            const files = fs.readdirSync(MANUKATO_UPLOAD_DIR);

            for (const file of files) {
                if (file.match(/\.(jpg|jpeg|png)$/i)) {
                    const filePath = path.join(MANUKATO_UPLOAD_DIR, file);
                    console.log(`Processing ${file}...`);

                    try {
                        // Convert to WebP
                        const { main } = await processImage(filePath, MANUKATO_UPLOAD_DIR);
                        const newRelativePath = `/uploads/manukato/${main}`;

                        // Update DB
                        const item = await ManukatoItem.findOne({
                            where: sequelize.where(
                                sequelize.fn('lower', sequelize.col('originalName')),
                                file.toLowerCase()
                            )
                        });

                        if (item) {
                            item.imagePath = newRelativePath;
                            await item.save();
                            console.log(`Updated DB record for ${file} -> ${main}`);
                        } else {
                            console.log(`No DB record found for ${file}`);
                        }

                    } catch (err) {
                        console.error(`Failed to process ${file}:`, err);
                    }
                }
            }
        } else {
            console.log('Manukato upload directory not found:', MANUKATO_UPLOAD_DIR);
        }

        console.log('Migration complete.');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        fs.writeFileSync(path.join(__dirname, 'conversion_error.txt'), `Error: ${error.message}\nStack: ${error.stack}`);
        process.exit(1);
    }
};

migrate();
