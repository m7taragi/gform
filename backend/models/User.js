const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Encrypted hash
    role: {
        type: String,
        enum: ['authority', 'employee', 'customer'],
        default: 'customer'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
