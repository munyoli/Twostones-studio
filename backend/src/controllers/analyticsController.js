const { PageVisit } = require('../models');

exports.recordVisit = async (req, res) => {
    try {
        const { path, referrer, userAgent } = req.body;
        
        // Asynchronously create the visit so we don't block the response
        PageVisit.create({
            path,
            referrer,
            userAgent
        }).catch(err => console.error('Failed to record page visit:', err));

        // Respond immediately
        res.status(204).send();
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        // We can expand this later with more complex queries (e.g., group by path)
        const totalVisits = await PageVisit.count();
        const recentVisits = await PageVisit.findAll({
            order: [['timestamp', 'DESC']],
            limit: 50
        });

        res.json({
            totalVisits,
            recentVisits
        });
    } catch (error) {
        console.error('Error fetching analytics stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
