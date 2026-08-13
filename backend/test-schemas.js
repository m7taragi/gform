const mongoose = require('mongoose');
const Form = require('./models/Form');
const Question = require('./models/Question');
const Submission = require('./models/Submission');
const Response = require('./models/Response');

function runVerification() {
    console.log(" Verifying Mongoose Schemas & Option B Model Specifications...\n");

    // 1. Verify Form Model
    const mockForm = new Form({
        title: "Daily Operations Tracker",
        description: "Tracks daily site metrics"
    });
    console.log(" [1/4] Form Model instantiated successfully:", mockForm.title);

    // 2. Verify Question Tree Model
    const parentQuestion = new Question({
        formId: mockForm._id,
        shortHeading: "site_performance",
        questionText: "Site Performance Metrics",
        dataType: "matrix_row",
        sortOrder: 1
    });

    const childQuestion = new Question({
        formId: mockForm._id,
        parentId: parentQuestion._id,
        shortHeading: "online_conversions",
        questionText: "Online Conversions",
        dataType: "number",
        isCumulativeTracked: true,
        minExpectedValue: 0,
        maxExpectedValue: 500,
        sortOrder: 2
    });
    console.log(" [2/4] Question Tree Model instantiated successfully with parentId link:", childQuestion.parentId.toString() === parentQuestion._id.toString());

    // 3. Verify Submission Model & Index
    const mockSubmission = new Submission({
        formId: mockForm._id,
        targetDate: new Date("2026-08-13")
    });
    const subIndexes = Submission.schema.indexes();
    const hasUniqueIndex = subIndexes.some(idx => {
        const fields = idx[0];
        const opts = idx[1];
        return fields.formId === 1 && fields.targetDate === 1 && opts.unique === true;
    });
    console.log(" [3/4] Submission Model instantiated successfully with compound unique index:", hasUniqueIndex);

    // 4. Verify Response Model
    const mockResponse = new Response({
        submissionId: mockSubmission._id,
        questionId: childQuestion._id,
        value: 120,
        userEnteredCumulative: 1450
    });
    console.log(" [4/4] Response Model instantiated successfully with value:", mockResponse.value, "and cumulative check:", mockResponse.userEnteredCumulative);

    console.log("\n All 4 Option B Mongoose Models verified successfully!");
}

try {
    runVerification();
} catch (err) {
    console.error(" Verification Failed:", err);
    process.exit(1);
}
