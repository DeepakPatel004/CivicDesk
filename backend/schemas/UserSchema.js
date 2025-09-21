const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

 const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true,
    },
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
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

// Hash password before saving the user model
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    // Hash the password with a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// --- MODEL CREATION ---
// Create the final model that our controllers will use.
const User = mongoose.model('User', userSchema);

module.exports = User;
