const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    source: { type: String, enum: ['personal', 'business'], required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false },
    recipient: { type: String }, // To whom amount is sent
    description: { type: String } // What purpose
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
