class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }

    async getSummaryReport(req, res) {
        try {
            const result = await this.reportService.getSummaryReport(req.query);
            return res.status(200).json(result);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ error: error.message });
            }
            return res.status(500).json({
                error: "Failed to generate summary report",
                details: error.message
            });
        }
    }
}

module.exports = ReportController;
