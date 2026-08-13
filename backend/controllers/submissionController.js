const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const Response = require('../models/Response');
const Question = require('../models/Question');

class SubmissionController {
    // Submit daily entry with cumulative validation
    async createOrUpdateSubmission(req, res) {
        try {
            const { formId, targetDate, submittedBy, answers } = req.body;

            if (!formId || !targetDate || !Array.isArray(answers)) {
                return res.status(400).json({ error: "formId, targetDate, and an array of answers are required." });
            }

            const parsedDate = new Date(targetDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ error: "Invalid targetDate format." });
            }

            const mismatches = [];
            const processedAnswers = [];

            // Perform cumulative validation for questions with isCumulativeTracked = true
            for (const ans of answers) {
                const { questionId, todayValue = 0, userEnteredCumulative = null } = ans;

                if (!questionId) continue;

                const question = await Question.findById(questionId);
                if (!question) {
                    return res.status(404).json({ error: `Question with ID ${questionId} not found.` });
                }

                if (question.isCumulativeTracked && userEnteredCumulative !== null) {
                    // Aggregate all historical inputs strictly prior to targetDate
                    const historicalAgg = await Response.aggregate([
                        {
                            $lookup: {
                                from: 'submissions',
                                localField: 'submissionId',
                                foreignField: '_id',
                                as: 'submission'
                            }
                        },
                        { $unwind: '$submission' },
                        {
                            $match: {
                                'submission.formId': new mongoose.Types.ObjectId(formId),
                                'submission.targetDate': { $lt: parsedDate },
                                questionId: new mongoose.Types.ObjectId(questionId)
                            }
                        },
                        {
                            $group: {
                                _id: '$questionId',
                                historicalSum: { $sum: '$value' }
                            }
                        }
                    ]);

                    const priorSum = historicalAgg.length > 0 ? historicalAgg[0].historicalSum : 0;
                    const expectedCumulative = priorSum + Number(todayValue);

                    if (expectedCumulative !== Number(userEnteredCumulative)) {
                        mismatches.push({
                            questionId,
                            shortHeading: question.shortHeading,
                            todayValue: Number(todayValue),
                            userEnteredCumulative: Number(userEnteredCumulative),
                            calculatedPriorSum: priorSum,
                            expectedCumulative
                        });
                    }
                }

                processedAnswers.push({
                    questionId,
                    value: Number(todayValue),
                    userEnteredCumulative: userEnteredCumulative !== null ? Number(userEnteredCumulative) : null
                });
            }

            // If cumulative mismatches found, reject submission with HTTP 422
            if (mismatches.length > 0) {
                return res.status(422).json({
                    error: "Cumulative validation failed. User-entered cumulative total does not match computed historical sum + today's value.",
                    mismatches
                });
            }

            // Find or create Submission anchor
            let submission = await Submission.findOne({
                formId,
                targetDate: parsedDate
            });

            if (!submission) {
                submission = new Submission({
                    formId,
                    targetDate: parsedDate,
                    submittedBy: submittedBy || null
                });
                await submission.save();
            }

            // Bulk upsert response documents for each answer
            const bulkOps = processedAnswers.map(ans => ({
                updateOne: {
                    filter: { submissionId: submission._id, questionId: ans.questionId },
                    update: {
                        $set: {
                            value: ans.value,
                            userEnteredCumulative: ans.userEnteredCumulative
                        }
                    },
                    upsert: true
                }
            }));

            if (bulkOps.length > 0) {
                await Response.bulkWrite(bulkOps);
            }

            const savedResponses = await Response.find({ submissionId: submission._id });

            return res.status(201).json({
                message: "Daily submission recorded successfully.",
                submission,
                responses: savedResponses
            });

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    // Retrieve daily submission by formId & targetDate
    async getSubmissionByDate(req, res) {
        try {
            const { formId, targetDate } = req.params;
            const parsedDate = new Date(targetDate);

            const submission = await Submission.findOne({ formId, targetDate: parsedDate });
            if (!submission) {
                return res.status(404).json({ error: "No submission found for the specified date." });
            }

            const responses = await Response.find({ submissionId: submission._id }).populate('questionId');

            return res.status(200).json({
                submission,
                responses
            });
        } catch (error) {
            return res.status(500).json({ error: "Failed to retrieve submission", details: error.message });
        }
    }
}

module.exports = new SubmissionController();
