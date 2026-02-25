const { ManukatoItem } = require('./src/models');
const { uploadFile } = require('./src/utils/storage');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Force IPv4 resolution for Windows compatibility with some networks
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const UPLOAD_DIR = path.join(__dirname, 'src/public/uploads/manukato');
const BUCKET_NAME = 'manukato';

async function migrateImages() {
    try {
        console.log('Fetching items from database...');
        const items = await ManukatoItem.findAll();
        console.log(`Found ${items.length} items to process.`);

        for (const item of items) {
            // imagePath is like "/uploads/manukato/FileName.webp"
            const fileName = path.basename(item.imagePath);
            const localPath = path.join(UPLOAD_DIR, fileName);

            if (fs.existsSync(localPath)) {
                console.log(`Uploading ${fileName} to Supabase...`);
                try {
                    const publicUrl = await uploadFile(localPath, BUCKET_NAME, fileName);

                    console.log(`Updating DB for item ${item.id}: ${publicUrl}`);
                    await item.update({ imagePath: publicUrl });
                    console.log(`✅ Success for ${fileName}`);
                } catch (uploadError) {
                    console.error(`❌ Failed to upload ${fileName}:`, uploadError.message);
                }
            } else {
                console.warn(`⚠️  File not found locally: ${localPath}`);
            }
        }

        console.log('\n🎉 Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateImages();
