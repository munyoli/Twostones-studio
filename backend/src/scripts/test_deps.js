const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Testing dependencies...');

async function test() {
    try {
        console.log('1. Testing Sharp...');
        const sharp = require('sharp');
        const semver = require('semver'); // internal usage by sharp usually or just checking version
        console.log('Sharp version:', require('sharp/package.json').version);

        // Create a dummy image buffer (1x1 pixel)
        const buffer = await sharp({
            create: {
                width: 1,
                height: 1,
                channels: 4,
                background: { r: 255, g: 0, b: 0, alpha: 0.5 }
            }
        }).webp().toBuffer();
        console.log('Sharp WebP generation successful, buffer length:', buffer.length);

    } catch (e) {
        console.error('Sharp failed:', e);
    }

    try {
        console.log('2. Testing Database...');
        const { sequelize } = require('../utils/db');
        await sequelize.authenticate();
        console.log('Database connection successful.');
    } catch (e) {
        console.error('Database failed:', e);
    }
}

test();
