const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Get all transactions for user
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a transaction
router.post('/', auth, async (req, res) => {
    try {
        const { type, category, amount, date, source, project_id, recipient, description } = req.body;
        const newTransaction = new Transaction({
            user_id: req.user.id,
            type,
            category,
            amount,
            date: date || Date.now(),
            source,
            project_id: project_id || null,
            recipient,
            description
        });
        const transaction = await newTransaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        
        if (transaction.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await transaction.remove();
        res.json({ message: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
