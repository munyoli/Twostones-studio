const fs = require('fs');
const path = require('path'); // Import path module
const stylistService = require('../services/stylistService');
const { Product, ProductImage } = require('../models');
const { Op } = require('sequelize');

const logToFile = (msg) => {
    try {
        const logPath = path.join(__dirname, '../../debug_log.txt');
        fs.appendFileSync(logPath, new Date().toISOString() + ' ' + msg + '\n');
    } catch (e) {
        // console.error("Log error", e);
    }
};

const recommend = async (req, res) => {
    logToFile("CONTROLLER: Entered recommend function");
    try {
        logToFile("CONTROLLER: Imports check");
        if (!stylistService) throw new Error("stylistService is undefined");

        logToFile("CONTROLLER: req.body raw: " + JSON.stringify(req.body));

        // Destructure
        const { bodyType, undertone, occasion, measurements } = req.body || {};
        logToFile(`CONTROLLER: Parsed Inputs - Body: ${bodyType}, Tone: ${undertone}, Occasion: ${occasion}`);

        logToFile("CONTROLLER: Calling service...");
        const stylingProfile = await stylistService.getRecommendation({
            bodyType,
            undertone,
            occasion,
            measurements
        });

        logToFile("CONTROLLER: Service returned data. Keys: " + (stylingProfile ? Object.keys(stylingProfile).join(',') : "NULL"));

        res.json(stylingProfile);
        logToFile("CONTROLLER: Response sent.");

    } catch (error) {
        logToFile("CONTROLLER ERROR: " + error.message);
        logToFile("STACK: " + error.stack);
        console.error('Stylist Error:', error);
        res.status(500).json({ message: 'Error generating recommendations', error: error.message });
    }
};

module.exports = { recommend };
