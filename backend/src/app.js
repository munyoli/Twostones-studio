const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const journalRoutes = require('./routes/journalRoutes');
const stylistRoutes = require('./routes/stylistRoutes');
const adminRoutes = require('./routes/adminRoutes');
const manukatoRoutes = require('./routes/manukatoRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

const corsOptions = {
    origin: '*', // For now keep it permissive to avoid blocking the live site, but we can refine this later
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Log static file requests for debugging
app.use('/uploads', (req, res, next) => {
    console.log(`[Static File Request] ${req.method} ${req.url}`);
    next();
}, express.static(path.join(__dirname, 'public/uploads')));

app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is healthy', timestamp: new Date().toISOString() });
});

// --- Root Route ---
// 1. Check if a frontend build exists to serve it
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendBuildPath)) {
    // Serve static files from the build folder
    app.use(express.static(frontendBuildPath));
}

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/stylist', stylistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collection/manukato', manukatoRoutes);
app.use('/api/user', measurementRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch-all route to serve the React app for any unhandled non-API paths
if (fs.existsSync(frontendBuildPath)) {
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.status(200).send(`
            <div style="font-family: serif; text-align: center; margin-top: 50px; color: #1a1a1a;">
                <h1 style="color: #c5a059;">Twostones API</h1>
                <p>The backend server for Twostones African Luxury is running.</p>
                <p style="color: #666; font-size: 0.8em;">The API is live and accessible.</p>
                <hr style="width: 50px; border-color: #c5a059;">
                <p style="font-size: 0.7em; text-transform: uppercase; letter-spacing: 2px;">Sanctified. Sophisticated. Secure.</p>
            </div>
        `);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
