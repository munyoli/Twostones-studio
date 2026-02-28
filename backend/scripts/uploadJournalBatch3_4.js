const { uploadFile } = require('../src/utils/storage');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const BUCKET_NAME = 'manukato';

const filesToUpload = [
    { day: 13, name: 'ruth', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day13_ruth_couture_v4_1772282221926.png' },
    { day: 14, name: 'naomi', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day14_naomi_couture_v4_1772282247293.png' },
    { day: 15, name: 'hannah', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day15_hannah_couture_v4_1772282263932.png' },
    { day: 16, name: 'abigail', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day16_abigail_couture_v4_1772282310123_jpg_1772282291406.png' },
    { day: 17, name: 'jezebel', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day17_jezebel_couture_v4_1772282310123_jpg_1772282307056.png' },
    { day: 18, name: 'athaliah', path: 'C:\\Users\\USER PC\\.gemini\\antigravity\\brain\\64624f61-7938-4a35-8287-9bedda4b7406\\day18_athaliah_couture_v4_1772282310123_jpg_1772282442810.png' }
];

async function uploadBatch() {
    console.log('Starting upload of 6 custom journal images (Days 13-18)...');
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

    fs.writeFileSync(path.join(__dirname, 'batch3_4_urls.json'), JSON.stringify(uploadedUrls, null, 2));
    console.log('URLs saved to batch3_4_urls.json');
    process.exit(0);
}

uploadBatch();
