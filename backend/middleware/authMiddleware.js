const jwt = require('jsonwebtoken');
const User = require('../schemas/UserSchema');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = async (req, res, next) => {
    // Get the token from the Authorization header
    // The header looks like: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user's ID to the request object for use in other routes
        req.user = decoded.user;
        
        // If the token is valid, proceed to the next function (the controller)
        next();
        
    } catch (error) {
        // If the token is invalid or expired
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
