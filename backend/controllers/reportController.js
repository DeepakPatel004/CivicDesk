const Report = require('../schemas/ReportSchema');
const User = require('../schemas/UserSchema');
const cloudinary = require('cloudinary').v2;

// Helper function to upload a file buffer to Cloudinary
async function uploadFileToCloudinary(file, folder) {
    // Convert the buffer to a base64 data URI
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;

    const options = {
        folder: folder,
        resource_type: "auto", // Automatically detect file type
    };

    // Upload the data URI to Cloudinary
    return await cloudinary.uploader.upload(dataURI, options);
}


// --- SUBMIT A NEW REPORT ---
exports.submitReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, location } = req.body;
        const photo = req.file; // The uploaded file is available via req.file from Multer

        // 1. Validations
        if (!photo) {
            return res.status(400).json({ message: "Photo is required." });
        }
        if (!description || !location) {
            return res.status(400).json({ message: "Description and location are required." });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 2. Check daily report limit
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysReports = user.reports.filter(report => report.submittedAt >= today);
        if (todaysReports.length >= 3) {
            return res.status(429).json({ message: "You have reached your daily report limit of 3." });
        }

        // 3. Upload the image to Cloudinary using the new helper
        const cloudinaryResponse = await uploadFileToCloudinary(photo, "CivicDesk/Reports");

        // 4. Create and save the new report with the Cloudinary URL
        // ** FIX: Use 'content' and 'photoUrl' to match the schema **
        const newReport = new Report({
            content: description, // Changed 'description' to 'content'
            photoUrl: cloudinaryResponse.secure_url, // Changed 'photo' to 'photoUrl'
            location: JSON.parse(location), // Parse the location JSON string from form data
            submittedBy: userId,
        });
        await newReport.save();

        // 5. Update user's report history
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
