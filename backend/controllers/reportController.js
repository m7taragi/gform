const mongoose = require('mongoose');
const Response = require('../models/Response');
const Question = require('../models/Question');

class ReportController {
    // Generate 3-vector summary report (Baseline, Period Progress, Total)
    async getSummaryReport(req, res) {
        try {
            const { formId, startDate, endDate } = req.query;

            if (!formId || !startDate || !endDate) {
                return res.status(400).json({
                    error: "Query parameters 'formId', 'startDate', and 'endDate' are required."
                });
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: "Invalid date format for startDate or endDate." });
            }

            if (start > end) {
                return res.status(400).json({ error: "startDate cannot be after endDate." });
            }

            // Aggregation pipeline computing Baseline, Period Progress, and Total vectors
            const summaryData = await Response.aggregate([
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
                        'submission.targetDate': { $lte: end }
                    }
                },
                {
                    $group: {
                        _id: '$questionId',
                        baseline: {
                            $sum: {
                                $cond: [
                                    { $lt: ['$submission.targetDate', start] },
                                    '$value',
                                    0
                                ]
                            }
                        },
                        periodProgress: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ['$submission.targetDate', start] },
                                            { $lte: ['$submission.targetDate', end] }
                                        ]
                                    },
                                    '$value',
                                    0
                                ]
                            }
                        },
                        total: { $sum: '$value' }
                    }
                },
                {
                    $lookup: {
                        from: 'questions',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'question'
                    }
                },
                { $unwind: '$question' },
                {
                    $project: {
                        questionId: '$_id',
                        shortHeading: '$question.shortHeading',
                        questionText: '$question.questionText',
                        parentId: '$question.parentId',
                        dataType: '$question.dataType',
                        sortOrder: '$question.sortOrder',
                        vectors: {
                            baseline: '$baseline',
                            periodProgress: '$periodProgress',
                            total: '$total'
                        }
                    }
                },
                { $sort: { sortOrder: 1 } }
            ]);

            // Also fetch questions that had 0 entries in the timeframe to ensure complete table headers
            const allQuestions = await Question.find({ formId }).sort({ sortOrder: 1 });
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

            return res.status(200).json({
                formId,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                metricsCount: metrics.length,
                metrics
            });

        } catch (error) {
            return res.status(500).json({
                error: "Failed to generate summary report",
                details: error.message
            });
        }
    }
}

module.exports = new ReportController();
