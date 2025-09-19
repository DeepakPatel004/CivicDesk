const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Using email for login is standard practice. It must be unique.
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    // Hashed password
    password: {
        type: String,
        required: true,
    },
    // A single array to store all report submissions.
    // Each item contains the report's ID and the date it was submitted.
    // This will be used for both the dashboard and the daily limit check.
    reports: [{
        reportId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

const User = mongoose.model('User', userSchema);

module.exports = User;