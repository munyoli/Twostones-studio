const { uploadFile } = require('./src/utils/storage');
const path = require('path');
const fs = require('fs');

async function testUpload() {
    const bucket = 'manukato';
    const source = path.join(__dirname, 'src/public/uploads/manukato/Sheba Furaha.webp');

    if (!fs.existsSync(source)) {
        console.error('Test file not found:', source);
        return;
    }

    try {
        console.log('Testing upload to bucket:', bucket);
        const uniqueName = `test-${Date.now()}.webp`;
        const url = await uploadFile(source, bucket, uniqueName);
        console.log('✅ Success! URL:', url);
    } catch (err) {
        console.error('❌ Upload failed!');
        fs.writeFileSync('error_log.json', JSON.stringify(err, null, 2));
        console.error('Full error written to error_log.json');
        console.error('Error Message:', err.message);
    }
}

testUpload();
