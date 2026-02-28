const { uploadFile } = require('../src/utils/storage');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const BUCKET_NAME = 'manukato';

const filesToUpload = [
    { day: 7, name: 'rachel', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day7_rachel_couture_v2_1772281299953.png' },
    { day: 8, name: 'jochebed', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day8_jochebed_couture_v2_1772281330940.png' },
    { day: 9, name: 'rahab', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day9_rahab_couture_v2_1772281364921.png' },
    { day: 10, name: 'deborah', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day10_deborah_couture_v2_1772281394345.png' }
];

async function uploadBatch() {
    console.log('Starting upload of 4 custom journal images (Batch 2)...');
    const uploadedUrls = {};
    for (const file of filesToUpload) {
        if (fs.existsSync(file.path)) {
            try {
                const targetPath = `journal/day${file.day}_${file.name}.png`;
                const url = await uploadFile(file.path, BUCKET_NAME, targetPath);
                console.log(`✅ Success for Day ${file.day} (${file.name}):`, url);
                uploadedUrls[file.day] = url;
            } catch (err) {
                console.error(`❌ Failed Day ${file.day}:`, err.message);
            }
        } else {
            console.log(`⚠️ Not found locally: ${file.path}`);
        }
    }

    fs.writeFileSync(path.join(__dirname, 'batch2_urls.json'), JSON.stringify(uploadedUrls, null, 2));
    console.log('URLs saved to batch2_urls.json');
    process.exit(0);
}

uploadBatch();
