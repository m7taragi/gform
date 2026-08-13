const express = require('express');
const router = express.Router();
const { z } = require('zod');
const validateInput = require('../middleware/validateInput');
const SubmissionRepository = require('../repositories/submissionRepository');
const SubmissionService = require('../services/submissionService');
const SubmissionController = require('../controllers/submissionController');

const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);
const submissionController = new SubmissionController(submissionService);

const submissionSchema = z.object({
    formId: z.string().min(1, "formId is required"),
    targetDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid targetDate format",
    }),
    submittedBy: z.string().optional(),
    answers: z.array(z.any()).min(1, "An array of answers is required")
});

router.post('/', validateInput(submissionSchema), (req, res) => submissionController.createOrUpdateSubmission(req, res));
router.get('/:formId/:targetDate', (req, res) => submissionController.getSubmissionByDate(req, res));

module.exports = router;
