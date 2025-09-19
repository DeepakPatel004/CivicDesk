const mongoose = require('mongoose');

const authoritySchema = new mongoose.Schema({
    // A structured location object that must match the structure in the Report schema.
    location: {
        district: {
            type: String,
            required: true,
            trim: true,
        },
        block: {
            type: String,
            required: true,
            trim: true,
        },
        locality: {
            type: String,
            required: true,
            trim: true,
        }
    },
    // The email address of the official or department responsible for this location.
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    // Optional: The name of the authority or department for clearer identification.
    authorityName: {
        type: String,
        trim: true,
    },
    // Optional: A contact number for the authority.
    contactNumber: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

// Create a compound index to ensure that each location mapping is unique.
authoritySchema.index({ 'location.district': 1, 'location.block': 1, 'location.locality': 1 }, { unique: true });

const Authority = mongoose.model('Authority', authoritySchema);

module.exports = Authority;