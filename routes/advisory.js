const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios'); // We need to add axios via npm install
const Transaction = require('../models/Transaction');
const Asset = require('../models/Asset');
const Goal = require('../models/Goal');

router.get('/insights', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id });
        const assets = await Asset.find({ user_id: req.user.id });
        const goals = await Goal.find({ user_id: req.user.id });

        // Calculate some basic stats to send to AI
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        
        const payload = {
            transactions,
            assets,
            goals,
            summary: {
                totalIncome,
                totalExpense,
                savings: totalIncome - totalExpense
            }
        };

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        
        // Let's call the Python Service
        const response = await axios.post(`${aiServiceUrl}/analyze`, payload);
        
        res.json(response.data);
    } catch (err) {
        console.error('Error communicating with AI service:', err.message);
        // Fallback or error
        res.status(500).json({ 
            message: 'AI Service unavailable', 
            localInsights: 'Keep spending less than you earn to remain stable!'
        });
    }
});

module.exports = router;
