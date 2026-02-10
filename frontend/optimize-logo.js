import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'src', 'assets', 'logo.png');
const outputPath = path.join(__dirname, 'src', 'assets', 'logo-optimized.png');

sharp(inputPath)
    .resize(512, 512, {
        fit: 'inside',
        withoutEnlargement: true
    })
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(outputPath)
    .then(info => {
        console.log('Logo optimized successfully:', info);
        // Replace original with optimized one
        fs.renameSync(outputPath, inputPath);
        console.log('Original logo replaced with optimized version.');
    })
    .catch(err => {
        console.error('Error optimizing logo:', err);
    });
