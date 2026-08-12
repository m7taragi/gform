const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    shortHeading: { type: String, required: true }, // Crucial for clean Excel columns (e.g., "sales_online")
    questionText: { type: String, required: true }, // The human-readable string asked to users
    dataType: {
        type: String,
        enum: ['text', 'number', 'date', 'select', 'matrix_row'],
        required: true
    },
    isMandatory: { type: Boolean, default: false },
    validationRules: {
        min: Number,
        max: Number
    },
    parentQuestionId: { type: String, default: null } // Groups matrix sub-questions to a parent heading
});

const FormSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
