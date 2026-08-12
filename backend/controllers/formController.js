class FormController {
    constructor(formRepository) {
        this.formRepository = formRepository;
    }

    // Create a brand new survey structure
    async createForm(req, res) {
        try {
            const { title, description, questions } = req.body;

            // Basic Server-Side Validation Check
            if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({ error: "Title and at least one question are required." });
            }

            const savedForm = await this.formRepository.createForm({ title, description, questions });
            return res.status(201).json(savedForm);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    // Retrieve all configured forms
    async getAllForms(req, res) {
        try {
            const forms = await this.formRepository.getAllForms();
            return res.status(200).json(forms);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    // Fetch a single form setup by its ID
    async getFormById(req, res) {
        try {
            const form = await this.formRepository.getFormById(req.params.id);
            if (!form) {
                return res.status(404).json({ error: "Requested Form structure not found." });
            }
            return res.status(200).json(form);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    // Submit survey answers into MongoDB Atlas
    async submitResponse(req, res) {
        try {
            const { formId, respondentType, trackerId, answers } = req.body;

            if (!formId || !answers || !Array.isArray(answers)) {
                return res.status(400).json({ error: "Invalid submission data package." });
            }

            // Instantly persist the response structure to database
            const Response = require('../models/Response'); // Adjust model import location if needed
            const newResponse = new Response({ formId, respondentType, trackerId, answers });
            await newResponse.save();

            return res.status(201).json({ message: "Response recorded successfully." });
        } catch (error) {
            return res.status(500).json({ error: "Submission failed", details: error.message });
        }
    }

    // Fetch all recorded data submissions matching a specific Form ID
    async getFormResponses(req, res) {
        try {
            const Response = require('../models/Response');
            const records = await Response.find({ formId: req.params.formId }).sort({ createdAt: -1 });
            return res.status(200).json(records);
        } catch (error) {
            return res.status(500).json({ error: "Retrieval failed", details: error.message });
        }
    }

}

module.exports = FormController;
