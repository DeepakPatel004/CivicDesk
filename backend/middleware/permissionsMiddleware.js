exports.isSuperAdmin = (req, res, next) => {
    // The employee's details are attached to req by the adminAuthMiddleware
    if (req.employee && req.employee.role === 'Super Admin') {
        next(); // User is a Super Admin, proceed to the controller
    } else {
        res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
    }
};
