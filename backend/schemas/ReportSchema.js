const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    // Reference to the user who submitted the report.
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, "A title is required for the report."],
        trim: true,
        maxlength: 100
    },
    //description of the report.
    content: {
        type: String,
        required: true,
    },
    // This will store the URL to the uploaded photo.
    photoUrl: {
        type: String,
        required: true,
    },
    // A structured object to store location details.
    // This makes it easy for the government to filter reports by area.
    location: {
        district: {
            type: String,
            required: true,
        },
        // 'Block' is a common administrative division in Jharkhand.
        block: {
            type: String,
            required: true,
        },
        // For more specific details like a street, neighborhood, or landmark.
        locality: {
            type: String,
            required: true,
        }
    },
    // Status of the report, can be 'pending', 'approved', 'rejected'.
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

    // Array to store the IDs of users who have upvoted this report.
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

