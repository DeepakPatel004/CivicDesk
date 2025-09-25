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
        console.log(12)
        const userId = req.user.id;
        // Destructure title from the request body
        const { title, description, location } = req.body;
        const photo = req.file;
        console.log(12)

        // Add title to the validation check
        if (!photo || !title || !description || !location) {
            return res.status(400).json({ message: "Photo, title, description, and location are required." });
        }
        
        // ... (User check and daily limit logic remains the same) ...

        // --- Asynchronous AI Call & Report Update ---
        // (This advanced logic remains the same, the user gets a fast response)
        
        // 1. Upload image to Cloudinary first
        const cloudinaryResponse = await uploadFileToCloudinary(photo, "CivicDesk/Reports");
        console.log(12)
        // 2. Create the initial report, now with the title
        let newReport = new Report({
            title, // Add the title here
            content: description,
            photoUrl: cloudinaryResponse.secure_url,
            location: JSON.parse(location),
            submittedBy: userId,
        });
        await newReport.save();
        console.log(12)
        
        // 3. Update user's report history
        const user = await User.findById(userId);
        user.reports.push({ reportId: newReport._id, submittedAt: Date.now() });
        await user.save();
        console.log(12)
        
        // 4. Respond to the user immediately
        res.status(201).json({
            message: "Report submitted successfully! It is now being analyzed.",
            report: newReport,
        });

        console.log(12)


        // 5. Asynchronously call the AI Service and update the report later
        (async () => {
            // ... (The async AI call logic remains the same) ...
        })();

    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).json({ message: "Server error during report submission." });
    }
};

// --- GET ALL REPORTS FOR THE LOGGED-IN USER ---
// This is the new function for the user's dashboard.
exports.getUserReports = async (req, res) => {
    try {
        // The user's ID is available from the authMiddleware
        const userId = req.user.id;

        // Find all reports where 'submittedBy' matches the logged-in user's ID
        // Sort by the most recent reports first
        const reports = await Report.find({ submittedBy: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "User reports fetched successfully.",
            reports: reports,
        });

    } catch (error) {
        console.error("Error fetching user reports:", error);
        res.status(500).json({ message: "Server error while fetching reports." });
    }
};

//  Get Reports from User's District ---
exports.getDistrictReports = async (req, res) => {
    try {
        // Get the district from the URL's query string (e.g., /district-feed?district=Ranchi)
        const { district } = req.query;

        if (!district) {
            return res.status(400).json({ message: "District query parameter is required." });
        }

        // Find reports from the specified district, excluding the user's own reports.
        const districtReports = await Report.find({
            'location.district': district,
            // 'submittedBy': { $ne: req.user.id } // $ne means "not equal"
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('submittedBy', 'name');
        console.log("district reports: ", districtReports)

        res.status(200).json({
            message: `Reports for ${district} fetched successfully.`,
            reports: districtReports
        });

    } catch (error) {
        console.error("Error fetching district reports:", error);
        res.status(500).json({ message: "Server error while fetching district reports." });
    }
};


// Toggle Upvote a Report ---
exports.upvoteReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const userId = req.user.id;

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found." });
        }

        // Check if the user's ID is already in the upvotes array
        const hasUpvoted = report.upvotes.includes(userId);
        let message;

        if (hasUpvoted) {
            // If the user has already upvoted, remove their ID from the array
            report.upvotes.pull(userId);
            message = "Upvote removed successfully.";
        } else {
            // If the user has not upvoted, add their ID to the array
            report.upvotes.push(userId);
            message = "Report upvoted successfully.";
        }
        
        await report.save();

        res.status(200).json({
            message: message,
            report: report
        });

    } catch (error) {
        console.error("Error toggling upvote on report:", error);
        res.status(500).json({ message: "Server error while toggling upvote." });
    }
};

