const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true,
        index: true
    },
    targetDate: {
        type: Date,
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'submitted'],
        default: 'submitted'
    }
}, { timestamps: true });

// Strict unique compound index enforcing Option B: exact 1 daily submission entry per formId + targetDate
SubmissionSchema.index({ formId: 1, targetDate: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
