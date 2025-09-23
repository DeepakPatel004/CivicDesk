const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Employee'],
        required: true,
    },
    location: {
        district: {
            type: String,
            // Only required if the role is a standard Employee
            required: function() { return this.role === 'Employee'; }
        }
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Hash password before saving
employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('Employee', employeeSchema);