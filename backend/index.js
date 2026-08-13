const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // 1. Import connection script
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const reportRoutes = require('./routes/reportRoutes');

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
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/reports', reportRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Insights API Backend Service is active.',
        endpoints: {
            health: '/api/health',
            forms: '/api/forms',
            submissions: '/api/submissions',
            reports: '/api/reports'
        }
    });
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Insights Backend is running cleanly.' });
});

// Local dev server execution listener
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
