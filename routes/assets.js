const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Asset = require('../models/Asset');

// Get all assets
router.get('/', auth, async (req, res) => {
    try {
        const assets = await Asset.find({ user_id: req.user.id });
        res.json(assets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add an asset
router.post('/', auth, async (req, res) => {
    try {
        const { type, name, quantity, purchase_price, current_price } = req.body;
        const newAsset = new Asset({
            user_id: req.user.id,
            type,
            name,
            quantity,
            purchase_price,
            current_price: current_price || purchase_price
        });
        const asset = await newAsset.save();
        res.json(asset);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update asset
router.put('/:id', auth, async (req, res) => {
    try {
        const { current_price, quantity } = req.body;
        let asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });

        if (asset.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (current_price) asset.current_price = current_price;
        if (quantity !== undefined) asset.quantity = quantity;
        
        await asset.save();
        res.json(asset);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete asset
router.delete('/:id', auth, async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });

        if (asset.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await asset.remove();
        res.json({ message: 'Asset removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
