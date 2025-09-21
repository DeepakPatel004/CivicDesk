const express = require('express');
const router = express.Router();

// Import the security middleware that checks for a valid JWT
const authMiddleware = require('../middleware/authMiddleware');

// Import the controller function that contains the logic
const { submitReport } = require('../controllers/reportController');

// --- DEFINE THE REPORT SUBMISSION ROUTE ---
// The final URL will be POST /api/reports/submit
// 1. A request hits this URL.
// 2. The authMiddleware runs first to verify the user's token.
// 3. If the token is valid, the request is passed to the submitReport function.
router.post('/submit', authMiddleware, submitReport);


module.exports = router;

