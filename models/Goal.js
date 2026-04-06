const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    target_amount: { type: Number, required: true },
    deadline: { type: Date, required: true },
    progress: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
