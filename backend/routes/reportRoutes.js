const express = require('express');
const router = express.Router();

// Import the security and upload middlewares
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <-- Import Multer middleware
const { submitReport, getUserReports } = require('../controllers/reportController');

// --- DEFINE THE REPORT SUBMISSION ROUTE ---
// The final URL will be POST /api/reports/submit
// 1. A request hits this URL.
// 2. The authMiddleware runs to verify the user's token.
// 3. The upload.single('photo') middleware runs to process the single file upload.
// 4. The request is passed to the submitReport function.
router.post('/submit', authMiddleware, upload.single('photo'), submitReport);

// Route for getting the logged-in user's reports (GET /api/reports/my-reports)
router.get('/my-reports', authMiddleware, getUserReports);


module.exports = router;
