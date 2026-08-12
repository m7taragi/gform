const express = require('express');
const router = express.Router();
const FormRepository = require('../repositories/formRepository');
const FormController = require('../controllers/formController');

// Inject the Repository dependency into our Controller (DIP)
const formRepository = new FormRepository();
const formController = new FormController(formRepository);

// Setup endpoints for senior authorities
router.post('/', (req, res) => formController.createForm(req, res));
router.get('/', (req, res) => formController.getAllForms(req, res));
router.get('/:id', (req, res) => formController.getFormById(req, res));
router.post('/:formId/submit', (req, res) => formController.submitResponse(req, res));
router.get('/:formId/responses', (req, res) => formController.getFormResponses(req, res));

module.exports = router;
