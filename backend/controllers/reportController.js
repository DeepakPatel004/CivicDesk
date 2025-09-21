const Report = require('../models/Report');
const User = require('../models/User');

// --- SUBMIT A NEW REPORT ---
// This function is protected and requires a user to be logged in.
exports.submitReport = async (req, res) => {
    try {
        // The user's ID is available from the authMiddleware
        const userId = req.user.id;

        // Get report details from the request body
        const { description, photo, location } = req.body;

        // 1. Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 2. Check the daily report submission limit
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

        const todaysReports = user.reports.filter(report => {
            return report.submittedAt >= today;
        });

        if (todaysReports.length >= 3) {
            return res.status(429).json({ message: "You have reached your daily report limit of 3." });
        }

        // 3. Create and save the new report
        const newReport = new Report({
            description,
            photo,
            location,
            submittedBy: userId, // Link the report to the user
        });
        await newReport.save();

        // 4. Update the user's report history
        user.reports.push({ reportId: newReport._id, submittedAt: Date.now() });
        await user.save();

        res.status(201).json({
            message: "Report submitted successfully!",
            report: newReport,
        });

    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).json({ message: "Server error during report submission." });
    }
};