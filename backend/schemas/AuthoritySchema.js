const mongoose = require('mongoose');

const authoritySchema = new mongoose.Schema({
    location: {
        district: {
            type: String,
            required: true,
            trim: true,
        },
        block: {
            type: String,
            trim: true,
        },
        locality: {
            type: String,
            trim: true,
        }
    },
    officialEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    department: { // Optional: To specify which department is responsible
        type: String,
        trim: true,
    }
}, { timestamps: true });

// Create a compound index to prevent duplicate entries for the same location
authoritySchema.index({ 'location.district': 1, 'location.block': 1, 'location.locality': 1 }, { unique: true });

module.exports = mongoose.model('Authority', authoritySchema);