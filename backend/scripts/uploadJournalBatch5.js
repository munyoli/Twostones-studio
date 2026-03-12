const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { uploadFile } = require('../src/utils/storage');
const fs = require('fs');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const BUCKET_NAME = 'manukato';

// The images generated in this session
const filesToUpload = [
    { day: 19, name: 'esther', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day19_esther_1773315999534.png' },
    { day: 20, name: 'mary', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day20_mary_mother_1773316016395.png' },
    { day: 21, name: 'elizabeth', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day21_elizabeth_1773316067039.png' },
    { day: 22, name: 'anna', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day22_anna_1773316141382.png' },
    { day: 23, name: 'samaritan_woman', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day23_samaritan_woman_1773316161707.png' },
    { day: 24, name: 'martha', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\46479675-bb59-4710-b019-a9c3140591b9\\day24_martha_1773316177809.png' }
];

async function uploadBatch() {
    console.log('Starting upload of 6 generated journal images (Days 19-24)...');
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

    fs.writeFileSync(path.join(__dirname, 'batch5_urls.json'), JSON.stringify(uploadedUrls, null, 2));
    console.log('URLs saved to batch5_urls.json');
    process.exit(0);
}

uploadBatch();
