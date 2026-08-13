const express = require('express');
const router = express.Router();
const { z } = require('zod');
const validateInput = require('../middleware/validateInput');
const FormRepository = require('../repositories/formRepository');
const ResponseRepository = require('../repositories/responseRepository');
const FormService = require('../services/formService');
const FormController = require('../controllers/formController');

// Inject dependencies
const formRepository = new FormRepository();
const responseRepository = new ResponseRepository();
const formService = new FormService(formRepository, responseRepository);
const formController = new FormController(formService);

const createFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    questions: z.array(z.any()).min(1, "At least one question is required")
});

const submitResponseSchema = z.object({
    formId: z.string().min(1, "Form ID is required"),
    respondentType: z.string().optional(),
    trackerId: z.string().optional(),
    answers: z.array(z.any()).min(1, "At least one answer is required")
});

router.post('/', validateInput(createFormSchema), (req, res) => formController.createForm(req, res));
router.get('/', (req, res) => formController.getAllForms(req, res));
router.get('/:id', (req, res) => formController.getFormById(req, res));
router.post('/:formId/submit', validateInput(submitResponseSchema), (req, res) => formController.submitResponse(req, res));
router.get('/:formId/responses', (req, res) => formController.getFormResponses(req, res));

module.exports = router;
