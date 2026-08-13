const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

// Submit daily responses with cumulative check
router.post('/', (req, res) => submissionController.createOrUpdateSubmission(req, res));

// Get daily submission by form ID and ISO target date string
router.get('/:formId/:targetDate', (req, res) => submissionController.getSubmissionByDate(req, res));

module.exports = router;
