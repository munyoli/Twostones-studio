const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const { ManukatoItem } = require('../models');

// Source folder at the project root (relative to backend)
const SOURCE_DIR = path.join(__dirname, '../../..', 'Manukato RTW Collection');
const UPLOAD_DIR = path.join(__dirname, '../public/uploads/manukato');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

console.log(`[Manukato Watcher] Monitoring: ${SOURCE_DIR}`);

const watcher = chokidar.watch(SOURCE_DIR, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: false // Process existing files on start
});

const processingFiles = new Set();

const processImage = async (filePath) => {
    const fileName = path.basename(filePath);

    // Prevent race conditions with a local set
    if (processingFiles.has(fileName)) return;
    processingFiles.add(fileName);

    try {
        // Check if already processed in DB
        const existing = await ManukatoItem.findOne({ where: { originalName: fileName } });
        if (existing) {
            processingFiles.delete(fileName);
            return;
        }

        // ... rest of processing ...

        // Process Image (WebP conversion + resizing)
        const { main } = await require('../utils/imageProcessor').processImage(filePath, UPLOAD_DIR);
        const relativeWebPath = `/uploads/manukato/${main}`;

        // Generate AI metadata (Luxury, Faith-based, African-inspired templates)
        const brandName = generateName(fileName);

        const descriptions = [
            `A purposeful expression of identity in Christ, this piece from the Manukato series reflects the beauty of holiness and the discipline of refined craftsmanship.`,
            `Where faith meets fashion. This garment is a reverent tribute to modest silhouettes, designed for a life of wholeness and artisanal excellence.`,
            `Crafted with intentionality, this exquisite piece captures the essence of a life surrendered to purpose. A testament to refined luxury and spiritual depth.`,
            `A masterpiece of artisanal discipline, celebrating the pursuit of excellence and the beauty of a virtuous life, reimagined for modern luxury.`
        ];

        const stylingList = [
            `Pair with Twostones minimalist jewelry and a spirit of peace for a complete luxury ensemble. Perfect for purposeful gatherings and elegant evenings.`,
            `Elevate with modest accessories to let the refined textures speak. We suggest neutral tones and structured pieces for a truly regal, graceful presence.`,
            `Versatile and grounded. Style with tailored trousers for a look that carries a powerful resonance of confidence and truth.`,
            `Layer with a lightweight silk shawl and structural accents to emphasize the modest yet sophisticated silhouette of this purposeful garment.`
        ];

        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        const stylingTips = stylingList[Math.floor(Math.random() * stylingList.length)];

        // Load price configuration
        let pricesConfig = { default_min: 250, default_max: 450, overrides: {} };
        try {
            const configPath = path.join(__dirname, '../data/manukato_prices.json');
            if (fs.existsSync(configPath)) {
                pricesConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            }
        } catch (e) {
            console.error('[Manukato Watcher] Error reading prices config:', e);
        }

        const itemConfig = pricesConfig.overrides[fileName];
        let finalPrice;
        let showInShop = true;

        if (typeof itemConfig === 'object') {
            finalPrice = itemConfig.price;
            showInShop = itemConfig.show_in_shop !== undefined ? itemConfig.show_in_shop : true;
        } else if (typeof itemConfig === 'number') {
            finalPrice = itemConfig;
        }

        finalPrice = finalPrice || (Math.floor(Math.random() * (pricesConfig.default_max - pricesConfig.default_min)) + pricesConfig.default_min);

        await ManukatoItem.create({
            originalName: fileName,
            imagePath: relativeWebPath,
            brandName: brandName,
            description: description,
            stylingTips: stylingTips,
            price: finalPrice,
            showInShop: showInShop
        });

        console.log(`[Manukato Watcher] Processed and added to collection: ${fileName}`);
    } catch (error) {
        console.error(`[Manukato Watcher] Error processing ${fileName}:`, error);
    } finally {
        processingFiles.delete(fileName);
    }
};

const generateName = (fileName) => {
    const base = path.parse(fileName).name.replace(/[-_]/g, ' ');
    // Remove "Garment" suffix - just capitalize the base name
    return base.charAt(0).toUpperCase() + base.slice(1);
};

watcher
    .on('add', path => processImage(path))
    .on('change', path => processImage(path));

module.exports = watcher;
