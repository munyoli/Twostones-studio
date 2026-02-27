const { uploadFile } = require('./src/utils/storage');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const UPLOAD_DIR = path.join(__dirname, 'src/public/uploads/portfolio');
const BUCKET_NAME = 'manukato'; // Using the same public bucket

async function uploadPortfolio() {
    const files = ['mens.png', 'bridal.png'];
    for (const fileName of files) {
        const localPath = path.join(UPLOAD_DIR, fileName);
        if (fs.existsSync(localPath)) {
            try {
                // Uploading them to a "portfolio/" prefix inside the manukato bucket
                const url = await uploadFile(localPath, BUCKET_NAME, `portfolio/${fileName}`);
                console.log(`✅ Success for ${fileName}:`, url);
            } catch (err) {
                console.error(`❌ Failed ${fileName}:`, err.message);
            }
        } else {
            console.log(`⚠️ Not found locally: ${localPath}`);
        }
    }
}

uploadPortfolio();
