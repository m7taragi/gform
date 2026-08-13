const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const Response = require('../models/Response');
const Question = require('../models/Question');

class SubmissionRepository {
    async getQuestionById(questionId) {
        return await Question.findById(questionId);
    }

    async getHistoricalSum(formId, targetDate, questionId) {
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
                    'submission.targetDate': { $lt: targetDate },
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
        return historicalAgg.length > 0 ? historicalAgg[0].historicalSum : 0;
    }

    async findSubmission(formId, targetDate) {
        return await Submission.findOne({ formId, targetDate });
    }

    async createSubmission(data) {
        const submission = new Submission(data);
        return await submission.save();
    }

    async bulkUpsertResponses(bulkOps) {
        return await Response.bulkWrite(bulkOps);
    }

    async findResponsesBySubmissionId(submissionId) {
        return await Response.find({ submissionId }).populate('questionId');
    }
}

module.exports = SubmissionRepository;
