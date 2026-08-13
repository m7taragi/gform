class ReportService {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }

    async getSummaryReport(queryData) {
        const { formId, startDate, endDate } = queryData;

        if (!formId || !startDate || !endDate) {
            const err = new Error("Query parameters 'formId', 'startDate', and 'endDate' are required.");
            err.status = 400;
            throw err;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            const err = new Error("Invalid date format for startDate or endDate.");
            err.status = 400;
            throw err;
        }

        if (start > end) {
            const err = new Error("startDate cannot be after endDate.");
            err.status = 400;
            throw err;
        }

        const summaryData = await this.reportRepository.getSummaryData(formId, start, end);
        const allQuestions = await this.reportRepository.getQuestionsByFormId(formId);

        const responseMap = new Map(summaryData.map(item => [item.questionId.toString(), item]));

        const metrics = allQuestions.map(q => {
            const existing = responseMap.get(q._id.toString());
            if (existing) return existing;
            return {
                questionId: q._id,
                shortHeading: q.shortHeading,
                questionText: q.questionText,
                parentId: q.parentId,
                dataType: q.dataType,
                sortOrder: q.sortOrder,
                vectors: {
                    baseline: 0,
                    periodProgress: 0,
                    total: 0
                }
            };
        });

        return {
            formId,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            metricsCount: metrics.length,
            metrics
        };
    }
}

module.exports = ReportService;
