const fs = require('fs');
const path = require('path');
const multer = require('multer');
const stylistService = require('../services/stylistService');

// Configure multer for memory storage (we don't need to save to disk)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WebP, and HEIC images are allowed'), false);
        }
    }
});

const logToFile = (msg) => {
    try {
        const logPath = path.join(__dirname, '../../debug_log.txt');
        fs.appendFileSync(logPath, new Date().toISOString() + ' ' + msg + '\n');
    } catch (e) {
        // silent
    }
};

/**
 * POST /api/stylist/recommend
 * Accepts either:
 *  - JSON body: { bodyType, undertone, occasion } (manual mode)
 *  - multipart/form-data with "photo" file + optional "occasion" field (AI mode)
 */
const recommend = async (req, res) => {
    logToFile("CONTROLLER: Entered recommend function");
    try {
        let bodyType, undertone, occasion, styleNotes;

        // Check if there's an uploaded photo
        if (req.file) {
            logToFile("CONTROLLER: Photo uploaded, analyzing with AI...");
            const analysis = await stylistService.analyzePhoto(req.file.buffer, req.file.mimetype);
            bodyType = analysis.bodyType;
            undertone = analysis.undertone;
            styleNotes = analysis.styleNotes;
            occasion = req.body.occasion || 'casual';
            logToFile(`CONTROLLER: AI Analysis - Body: ${bodyType}, Tone: ${undertone}`);
        } else {
            // Manual mode (JSON body)
            logToFile("CONTROLLER: Manual mode, using form data");
            bodyType = req.body.bodyType;
            undertone = req.body.undertone;
            occasion = req.body.occasion;
        }

        logToFile(`CONTROLLER: Final inputs - Body: ${bodyType}, Tone: ${undertone}, Occasion: ${occasion}`);

        const stylingProfile = await stylistService.getRecommendation({
            bodyType,
            undertone,
            occasion,
            measurements: req.body.measurements || {}
        });

        // Include AI analysis info if photo was used
        if (styleNotes) {
            stylingProfile.aiAnalysis = {
                bodyType,
                undertone,
                styleNotes,
                photoAnalyzed: true
            };
        }

        res.json(stylingProfile);
        logToFile("CONTROLLER: Response sent.");
    } catch (error) {
        logToFile("CONTROLLER ERROR: " + error.message);
        logToFile("STACK: " + error.stack);
        console.error('Stylist Error:', error);
        res.status(500).json({ message: 'Error generating recommendations', error: error.message });
    }
};

module.exports = { recommend, upload };
