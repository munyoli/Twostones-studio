const { uploadFile } = require('../src/utils/storage');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const BUCKET_NAME = 'manukato';

const filesToUpload = [
    { day: 11, name: 'jael', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day11_jael_couture_v3_1772281484356.png' },
    { day: 12, name: 'delilah', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day12_delilah_couture_v3_1772281514308.png' }
];

async function uploadBatch() {
    console.log('Starting upload of 2 custom journal images (Partial Batch 3)...');
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

    fs.writeFileSync(path.join(__dirname, 'batch3_urls.json'), JSON.stringify(uploadedUrls, null, 2));
    console.log('URLs saved to batch3_urls.json');
    process.exit(0);
}

uploadBatch();
