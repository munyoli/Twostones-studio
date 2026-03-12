const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { uploadFile } = require('../src/utils/storage');
const fs = require('fs');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const BUCKET_NAME = 'manukato';

const filesToUpload = [
    { day: 29, name: 'priscilla', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day29_priscilla_final_final_retry_1773320052139.png' }
];

async function uploadBatch() {
    console.log('Starting upload of the final journal image (Day 29)...');
    for (const file of filesToUpload) {
        if (fs.existsSync(file.path)) {
            try {
                const targetPath = `journal/day${file.day}_${file.name}.png`;
                const url = await uploadFile(file.path, BUCKET_NAME, targetPath);
                console.log(`✅ Success for Day ${file.day} (${file.name}):`, url);
            } catch (err) {
                console.error(`❌ Failed Day ${file.day}:`, err.message);
            }
        } else {
            console.log(`⚠️ Not found locally: ${file.path}`);
        }
    }
    process.exit(0);
}

uploadBatch();
