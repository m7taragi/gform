const mongoose = require('mongoose');
const Form = require('./models/Form');
const Question = require('./models/Question');
const Submission = require('./models/Submission');
const Response = require('./models/Response');
const submissionController = require('./controllers/submissionController');

async function testSubmissionLogic() {
    console.log(" Testing Submission API & Cumulative Validation logic...\n");

    const mockFormId = new mongoose.Types.ObjectId();
    const mockQuestionId = new mongoose.Types.ObjectId();

    // Mock Question document for query
    Question.findById = async (id) => ({
        _id: id,
        shortHeading: "sales_conversions",
        isCumulativeTracked: true,
        minExpectedValue: 0,
        maxExpectedValue: 100
    });

    // Mock historical aggregation response
    let mockHistoricalSum = 100;
    Response.aggregate = async () => [
        { _id: mockQuestionId, historicalSum: mockHistoricalSum }
    ];

    // Mock submission database queries & bulkWrite
    Submission.findOne = async () => null;
    Submission.prototype.save = async function() { this._id = new mongoose.Types.ObjectId(); return this; };
    Response.bulkWrite = async () => ({ ok: 1 });
    Response.find = async () => [{ questionId: mockQuestionId, value: 20, userEnteredCumulative: 120 }];

    // Test Case 1: Mismatched Cumulative Input (Expected 100 + 20 = 120, User provides 130)
    console.log(" [Test 1] Testing mismatched cumulative value (Day 2 entry: historical 100 + today 20 != user 130)");
    const reqFail = {
        body: {
            formId: mockFormId.toString(),
            targetDate: "2026-08-13",
            answers: [
                {
                    questionId: mockQuestionId.toString(),
                    todayValue: 20,
                    userEnteredCumulative: 130
                }
            ]
        }
    };

    const resFail = {
        statusCode: 0,
        data: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.data = payload; return this; }
    };

    await submissionController.createOrUpdateSubmission(reqFail, resFail);
    console.log(" Result Status Code:", resFail.statusCode);
    console.log(" Error response:", resFail.data.error);
    console.log(" Mismatch Diagnostic:", resFail.data.mismatches);
    if (resFail.statusCode !== 422) {
        throw new Error("Test Case 1 failed: Expected HTTP 422 for cumulative mismatch");
    }

    // Test Case 2: Exact Matching Cumulative Input (Historical 100 + today 20 == user 120)
    console.log("\n [Test 2] Testing matching cumulative value (Day 2 entry: historical 100 + today 20 == user 120)");
    const reqSuccess = {
        body: {
            formId: mockFormId.toString(),
            targetDate: "2026-08-13",
            answers: [
                {
                    questionId: mockQuestionId.toString(),
                    todayValue: 20,
                    userEnteredCumulative: 120
                }
            ]
        }
    };

    const resSuccess = {
        statusCode: 0,
        data: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.data = payload; return this; }
    };

    await submissionController.createOrUpdateSubmission(reqSuccess, resSuccess);
    console.log(" Result Status Code:", resSuccess.statusCode);
    console.log(" Success message:", resSuccess.data.message);
    if (resSuccess.statusCode !== 201) {
        throw new Error("Test Case 2 failed: Expected HTTP 201 for valid cumulative submission");
    }

    console.log("\n All Cumulative Submission API Unit Tests Passed cleanly!");
}

testSubmissionLogic().catch(err => {
    console.error(" Unit Test Execution Failed:", err);
    process.exit(1);
});
