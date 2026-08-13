class FormController {
    constructor(formService) {
        this.formService = formService;
    }

    async createForm(req, res) {
        try {
            const savedForm = await this.formService.createForm(req.body);
            return res.status(201).json(savedForm);
        } catch (error) {
            if (error.message === "Title and at least one question are required.") {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    async getAllForms(req, res) {
        try {
            const forms = await this.formService.getAllForms();
            return res.status(200).json(forms);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    async getFormById(req, res) {
        try {
            const form = await this.formService.getFormById(req.params.id);
            return res.status(200).json(form);
        } catch (error) {
            if (error.message === "Requested Form structure not found.") {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    async submitResponse(req, res) {
        try {
            await this.formService.submitResponse(req.body);
            return res.status(201).json({ message: "Response recorded successfully." });
        } catch (error) {
            if (error.message === "Invalid submission data package.") {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Submission failed", details: error.message });
        }
    }

    async getFormResponses(req, res) {
        try {
            const records = await this.formService.getFormResponses(req.params.formId);
            return res.status(200).json(records);
        } catch (error) {
            return res.status(500).json({ error: "Retrieval failed", details: error.message });
        }
    }
}

module.exports = FormController;
