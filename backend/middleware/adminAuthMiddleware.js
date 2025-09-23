const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const adminAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the same secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // **IMPORTANT**: Attach the employee's details to the request object
        // We use req.employee to avoid conflicts with the user-side req.user
        req.employee = decoded.employee; 
        
        next();
        
    } catch (error) {
        console.error("Admin token verification failed:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = adminAuthMiddleware;