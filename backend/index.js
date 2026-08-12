const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // 1. Import connection script
const formRoutes = require('./routes/formRoutes'); // 1. Import your routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dynamic connection hook injection middleware (Fulfills SRP)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database runtime connection failure", details: err.message });
    }
});

// Register API Routes
app.use('/api/forms', formRoutes); // 2. Mount routes onto /api/forms

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Insights Backend is running cleanly.' });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

module.exports = app;
