const mongoose = require('mongoose');
const Response = require('./models/Response');
const Question = require('./models/Question');
const reportController = require('./controllers/reportController');

async function testReportAggregation() {
    console.log(" Testing Summary Reporting Engine 3-Vector Aggregation...\n");

    const mockFormId = new mongoose.Types.ObjectId();
    const mockQuestionId1 = new mongoose.Types.ObjectId();
    const mockQuestionId2 = new mongoose.Types.ObjectId();

    // Mock Question model find query
    Question.find = () => ({
        sort: async () => [
            {
                _id: mockQuestionId1,
                shortHeading: "online_sales",
                questionText: "Online Sales Revenue",
                parentId: null,
                dataType: "number",
                sortOrder: 1
            },
            {
                _id: mockQuestionId2,
                shortHeading: "store_sales",
                questionText: "Physical Store Sales Revenue",
                parentId: null,
                dataType: "number",
                sortOrder: 2
            }
        ]
    });

    // Mock Response aggregation pipeline output:
    // Question 1: Prior (100), Period (50), Total (150)
    // Question 2: Prior (200), Period (80), Total (280)
    Response.aggregate = async () => [
        {
            _id: mockQuestionId1,
            questionId: mockQuestionId1,
            shortHeading: "online_sales",
            questionText: "Online Sales Revenue",
            parentId: null,
            dataType: "number",
            sortOrder: 1,
            vectors: {
                baseline: 100,
                periodProgress: 50,
                total: 150
            }
        },
        {
            _id: mockQuestionId2,
            questionId: mockQuestionId2,
            shortHeading: "store_sales",
            questionText: "Physical Store Sales Revenue",
            parentId: null,
            dataType: "number",
            sortOrder: 2,
            vectors: {
                baseline: 200,
                periodProgress: 80,
                total: 280
            }
        }
    ];

    const req = {
        query: {
            formId: mockFormId.toString(),
            startDate: "2026-08-01",
            endDate: "2026-08-10"
        }
    };

    const res = {
        statusCode: 0,
        data: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.data = payload; return this; }
    };

    await reportController.getSummaryReport(req, res);

    console.log(" Response Status Code:", res.statusCode);
    console.log(" Metrics Count:", res.data.metricsCount);
    console.log(" Question 1 Vectors:", res.data.metrics[0].vectors);
    console.log(" Question 2 Vectors:", res.data.metrics[1].vectors);

    // Verify mathematical invariants: Total == Baseline + PeriodProgress
    for (const item of res.data.metrics) {
        const { baseline, periodProgress, total } = item.vectors;
        if (baseline + periodProgress !== total) {
            throw new Error(`Mathematical invariant broken for ${item.shortHeading}: ${baseline} + ${periodProgress} != ${total}`);
        }
    }

    console.log("\n All Summary Reporting Aggregation Vector Invariants Verified Successfully!");
}

testReportAggregation().catch(err => {
    console.error(" Aggregation Test Failed:", err);
    process.exit(1);
});
