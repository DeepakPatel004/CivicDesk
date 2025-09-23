const User = require('../schemas/UserSchema');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');


// --- 1. SIGNUP ---
// Handles the first step: creating a user and sending an OTP.
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if a verified user already exists
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ message: "User with this email already exists and is verified." });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Hash the OTP for security
        const hashedOtp = await bcrypt.hash(otp, 10);

        // If user exists but is not verified, update them. Otherwise, create a new user.
        if (user) {
            // This user tried to sign up before but didn't verify.
            user.name = name;
            user.password = password; // The pre-save hook will hash this on save
            user.otp = hashedOtp;
            user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        } else {
            // This is a completely new user.
            user = new User({
                name,
                email,
                password, // The pre-save hook will hash this on save
                otp: hashedOtp,
                otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
            });
        }
        
        // This .save() command WILL trigger the pre-save password hashing middleware
        await user.save();
        

        // Send the plain OTP via email
        await mailSender(
            email,
            "Verification OTP for CivicDesk",
            `<h1>Your OTP for registration is: ${otp}</h1>`
        );

        res.status(201).json({
            message: "Registration successful! Please check your email for the OTP.",
            user: { id: user._id, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during signup." });
    }
};


// --- 2. VERIFY OTP ---
// Handles the second step: verifying the OTP and logging the user in.
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        

        // Find user by email
        const user = await User.findOne({ email });

        // Validations
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified." });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired. Please sign up again." });
        }

        // Compare the provided OTP with the hashed OTP in the database
        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // If OTP is correct, update the user
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Create JWT token to log the user in
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });

        res.status(200).json({
            message: "Email verified successfully! You are now logged in.",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during OTP verification." });
    }
};
// --- 3. LOGIN ---
// Handles login for already verified users.
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Validations
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: "Your email is not verified. Please complete the OTP verification process." });
        }
      
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // If credentials are correct, create JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });

        res.status(200).json({
            message: "Logged in successfully.",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};

// --- 4. GET LOGGED-IN USER DETAILS ---
// This is the new, protected endpoint for the frontend to check if a user's token is valid.
exports.getLoggedInUser = async (req, res) => {
    try {
        // The authMiddleware has already verified the token and attached the user's ID to req.user
        const userId = req.user.id;

        // Find the user in the database, but exclude the sensitive password field
        const user = await User.findById(userId).select('-password');

        if (!user) {
            // This case is rare, but could happen if the user was deleted after the token was issued
            return res.status(404).json({ message: "User not found." });
        }

        // Send back the user's details
        res.status(200).json({
            message: "User is authenticated.",
            user: user
        });

    } catch (error) {
        console.error("Error fetching logged-in user:", error);
        res.status(500).json({ message: "Server error while fetching user profile." });
    }
}


