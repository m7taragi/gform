class SubmissionController {
    constructor(submissionService) {
        this.submissionService = submissionService;
    }

    async createOrUpdateSubmission(req, res) {
        try {
            const result = await this.submissionService.createOrUpdateSubmission(req.body);
            return res.status(201).json({
                message: "Daily submission recorded successfully.",
                submission: result.submission,
                responses: result.responses
            });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    error: error.message,
                    mismatches: error.mismatches
                });
            }
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    async getSubmissionByDate(req, res) {
        try {
            const { formId, targetDate } = req.params;
            const result = await this.submissionService.getSubmissionByDate(formId, targetDate);
            return res.status(200).json(result);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            return res.status(500).json({ error: "Failed to retrieve submission", details: error.message });
        }
    }
}

module.exports = SubmissionController;
