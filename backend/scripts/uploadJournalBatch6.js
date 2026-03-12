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
    { day: 25, name: 'mary_of_bethany', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day25_mary_of_bethany_v2_1773317066708.png' },
    { day: 26, name: 'mary_magdalene', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day26_mary_magdalene_v2_1773317180331.png' },
    { day: 27, name: 'dorcas', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day27_dorcas_v2_1773317613414.png' },
    { day: 28, name: 'lydia', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day28_lydia_v2_1773317713915.png' },
    { day: 30, name: 'sapphira', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day30_sapphira_v2_1773318420990.png' }
];

async function uploadBatch() {
    console.log('Starting upload of 5 final journal images (Batch 6)...');
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

    fs.writeFileSync(path.join(__dirname, 'batch6_urls.json'), JSON.stringify(uploadedUrls, null, 2));
    console.log('URLs saved to batch6_urls.json');
    process.exit(0);
}

uploadBatch();
