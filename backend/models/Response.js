const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    shortHeading: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    respondentType: {
        type: String,
        enum: ['authority', 'employee', 'customer'],
        default: 'employee'
    },
    trackerId: {
        type: String,
        default: 'N/A'
    },
    answers: [AnswerSchema]
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);
