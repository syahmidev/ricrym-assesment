const express = require('express');
const { getScores } = require('../services/scoreServices');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Fetch paginated scores
router.get('/scores', authMiddleware, async (req, res) => {
    const { page, limit, search } = req.query;

    try {
        const result = await getScores({ page: parseInt(page), limit: parseInt(limit), search });
        res.json(result);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

module.exports = router;
