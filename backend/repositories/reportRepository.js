const mongoose = require('mongoose');
const Response = require('../models/Response');
const Question = require('../models/Question');

class ReportRepository {
    async getSummaryData(formId, start, end) {
        return await Response.aggregate([
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
    }

    async getQuestionsByFormId(formId) {
        return await Question.find({ formId }).sort({ sortOrder: 1 });
    }
}

module.exports = ReportRepository;
