const express = require('express');
const router = express.Router();
const { z } = require('zod');
const validateInput = require('../middleware/validateInput');
const ReportRepository = require('../repositories/reportRepository');
const ReportService = require('../services/reportService');
const ReportController = require('../controllers/reportController');

const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);

// We can validate query params using a middleware adapted for req.query if needed,
// but since the original implementation didn't use body for GET, we can just use the service validations for now, 
// or implement a simple query validator.
// Let's implement a query validator here inline for simplicity, 
// since our validateInput middleware targets req.body by default.

const summaryQuerySchema = z.object({
    formId: z.string().min(1, "formId is required"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid startDate format",
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid endDate format",
    })
});

const validateQuery = (schema) => (req, res, next) => {
    try {
        schema.parse(req.query);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Query validation failed",
                details: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        return res.status(500).json({ error: "Internal validation error", details: error.message });
    }
};

// GET /api/reports/summary?formId=...&startDate=...&endDate=...
router.get('/summary', validateQuery(summaryQuerySchema), (req, res) => reportController.getSummaryReport(req, res));

module.exports = router;
