const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (to be added)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/market', require('./routes/market'));
app.use('/api/advisory', require('./routes/advisory'));
app.use('/api/projects', require('./routes/projects'));

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly' });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wealth_management';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
