const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true,
        index: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        default: null,
        index: true
    },
    shortHeading: {
        type: String,
        required: true,
        trim: true
    },
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    dataType: {
        type: String,
        enum: ['number', 'text', 'select', 'matrix_row'],
        default: 'number',
        required: true
    },
    isCumulativeTracked: {
        type: Boolean,
        default: false
    },
    minExpectedValue: {
        type: Number,
        default: null
    },
    maxExpectedValue: {
        type: Number,
        default: null
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Compound index for querying children under a form ordered by sort position
QuestionSchema.index({ formId: 1, parentId: 1, sortOrder: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
