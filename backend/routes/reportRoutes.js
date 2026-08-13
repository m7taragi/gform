const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/summary?formId=...&startDate=...&endDate=...
router.get('/summary', (req, res) => reportController.getSummaryReport(req, res));

module.exports = router;
