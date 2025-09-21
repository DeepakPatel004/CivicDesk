const express = require('express');
const router = express.Router();
const { signup, verifyOtp, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware
const reportController = require('../controllers/reportController');

// This route is now protected. The authMiddleware will run first.


// @route   POST /signup
// @desc    Step 1: User submits name, email, and password.
//          Backend creates user, saves a hashed OTP, and sends the OTP via email.
router.post('/signup', signup);


// @route   POST /verify-otp
// @desc    Step 2: User submits their email and the OTP from the email.
//          Backend verifies the OTP, marks the user as verified, and returns a JWT for login.
router.post('/verify-otp', verifyOtp);


// @route   POST /login
// @desc    Standard login route for already verified users.
router.post('/login', login);

// This route is now protected. The authMiddleware will run first.
router.post('/submit', authMiddleware, reportController.submitReport);


module.exports = router;