const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Process an image: convert to WebP, resize if needed, and generate responsive variants.
 * @param {string} sourcePath - Absolute path to the source image.
 * @param {string} outputDir - Directory to save processed files.
 * @returns {Promise<Object>} - Metadata including the main processed filename and variants.
 */
const processImage = async (sourcePath, outputDir) => {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = path.parse(sourcePath).name;
    const mainOutputFile = `${filename}.webp`;
    const mainOutputPath = path.join(outputDir, mainOutputFile);

    // Get metadata to check width
    const metadata = await sharp(sourcePath).metadata();
    const originalWidth = metadata.width;

    // 1. Process Main Image (Max 2000px, WebP, Quality 80)
    let pipeline = sharp(sourcePath).webp({ quality: 80 });

    if (originalWidth > 2000) {
        pipeline = pipeline.resize(2000);
    }

    await pipeline.toFile(mainOutputPath);

    // 2. Generate Variants (400w, 800w, 1200w)
    const variants = {};
    const widths = [400, 800, 1200];

    for (const width of widths) {
        if (originalWidth > width) { // Only generate if original is larger
            const variantFile = `${filename}-${width}.webp`;
            await sharp(sourcePath)
                .resize(width)
                .webp({ quality: 80 })
                .toFile(path.join(outputDir, variantFile));
            variants[width] = variantFile;
        }
    }

    return {
        main: mainOutputFile,
        variants
    };
};

module.exports = { processImage };
