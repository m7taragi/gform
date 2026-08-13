const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true,
        index: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
        index: true
    },
    value: {
        type: Number,
        required: true,
        default: 0
    },
    userEnteredCumulative: {
        type: Number,
        default: null
    }
}, { timestamps: true });

// Compound index to quickly fetch/upsert responses for a specific submission and question
ResponseSchema.index({ submissionId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Response', ResponseSchema);
