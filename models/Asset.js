const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['gold', 'silver', 'land', 'car', 'bike', 'cash', 'investment'], required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true }, // e.g., grams for gold, count for others
    purchase_price: { type: Number, required: true },
    current_price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
