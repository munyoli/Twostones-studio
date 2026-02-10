const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { auth } = require('../middleware/authMiddleware');

// Get user measurements
router.get('/measurements', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ measurements: user.measurements || {} });
    } catch (error) {
        console.error('Error fetching measurements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user measurements
router.put('/measurements', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.measurements = {
            ...user.measurements,
            ...req.body
        };

        await user.save();
        res.json({ message: 'Measurements updated successfully', measurements: user.measurements });
    } catch (error) {
        console.error('Error updating measurements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
