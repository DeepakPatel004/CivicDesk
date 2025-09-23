const Employee = require('../schemas/EmployeeSchema');
const Report = require('../schemas/ReportSchema');
const Authority = require('../schemas/AuthoritySchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ... (login function remains the same) ...
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ email });
        if (!employee || !employee.isActive) {
            return res.status(401).json({ message: "Invalid credentials or account is inactive." });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const payload = {
            employee: {
                id: employee.id,
                role: employee.role,
                location: employee.location
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({
            message: "Logged in successfully.",
            token,
            employee: { id: employee.id, name: employee.name, email: employee.email, role: employee.role }
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error during admin login." });
    }
};


// ... (getReports function remains the same) ...
exports.getReports = async (req, res) => {
    try {
        const employee = req.employee;
        let query = {};
        if (employee.role === 'Employee' && employee.location && employee.location.district) {
            query['location.district'] = employee.location.district;
        }
        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .populate('submittedBy', 'name email');
        res.status(200).json({
            message: "Reports fetched successfully.",
            reports: reports
        });
    } catch (error) {
        console.error("Error fetching reports for admin:", error);
        res.status(500).json({ message: "Server error while fetching reports." });
    }
};

// REGISTER A NEW EMPLOYEE (Super Admin Only) ---
exports.registerEmployee = async (req, res) => {
    try {
        const { name, email, password, role, location } = req.body;

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "An employee with this email already exists." });
        }

        const newEmployee = new Employee({
            name,
            email,
            password, // This will be hashed by the pre-save hook in the model
            role,
            location
        });

        await newEmployee.save();

        res.status(201).json({
            message: "Employee account created successfully.",
            employee: { id: newEmployee.id, name: newEmployee.name, email: newEmployee.email, role: newEmployee.role }
        });

    } catch (error) {
        console.error("Employee registration error:", error);
        res.status(500).json({ message: "Server error during employee registration." });
    }
};


//updateReportStatus
exports.updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params; // Get the report's ID from the URL
        const { status } = req.body; // Get the new status from the request body
        const employee = req.employee; // Get the logged-in employee from the middleware

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found." });
        }

        // --- PERMISSION CHECK ---
        // A standard Employee can only update reports in their assigned district.
        if (employee.role === 'Employee') {
            if (report.location.district !== employee.location.district) {
                return res.status(403).json({ message: "Permission denied. You can only update reports in your own district." });
            }
        }
        // Super Admins can update any report.

        report.status = status;
        await report.save();

        res.status(200).json({
            message: "Report status updated successfully.",
            report: report
        });

    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ message: "Server error while updating report status." });
    }
};

//GET ALL EMPLOYEE ACCOUNTS (Super Admin Only) 
exports.getAllEmployees = async (req, res) => {
    try {
        // Fetch all employees but exclude their passwords for security
        const employees = await Employee.find({}).select('-password');
        res.status(200).json({
            message: "All employee accounts fetched successfully.",
            employees: employees
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error while fetching employees." });
    }
};

// --- UPDATE AN EMPLOYEE'S ACTIVE STATUS (Super Admin Only) ---
exports.updateEmployeeStatus = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { isActive } = req.body; // Expecting { "isActive": true } or { "isActive": false }

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: "Invalid 'isActive' status provided." });
        }

        const employeeToUpdate = await Employee.findByIdAndUpdate(
            employeeId,
            { isActive: isActive },
            { new: true } // Return the updated document
        ).select('-password');

        if (!employeeToUpdate) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json({
            message: `Employee account has been ${isActive ? 'activated' : 'deactivated'}.`,
            employee: employeeToUpdate
        });

    } catch (error) {
        console.error("Error updating employee status:", error);
        res.status(500).json({ message: "Server error while updating employee status." });
    }
};


// GET ANALYTICS HEATMAP DATA (Super Admin Only) ---
exports.getHeatmapData = async (req, res) => {
    try {
        const { district } = req.query; // e.g., /api/admin/heatmap?district=Ranchi
        let aggregationPipeline = [];

        if (district) {
            aggregationPipeline.push(
                { $match: { 'location.district': district } },
                { $group: { _id: "$location.block", count: { $sum: 1 } } },
                { $project: { _id: 0, area: "$_id", count: 1 } }
            );
        } else {
            aggregationPipeline.push(
                { $group: { _id: "$location.district", count: { $sum: 1 } } },
                { $project: { _id: 0, area: "$_id", count: 1 } }
            );
        }
        const heatmapData = await Report.aggregate(aggregationPipeline);
        res.status(200).json({ message: "Heatmap data fetched successfully.", data: heatmapData });
    } catch (error) {
        console.error("Heatmap data error:", error);
        res.status(500).json({ message: "Server error while fetching heatmap data." });
    }
};

//  GET A SINGLE REPORT BY ID (for detail view) ---
exports.getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId).populate('submittedBy', 'name email');
        if (!report) {
            return res.status(404).json({ message: "Report not found." });
        }
        res.status(200).json({ message: "Report details fetched successfully.", report });
    } catch (error) {
        console.error("Error fetching single report:", error);
        res.status(500).json({ message: "Server error." });
    }
};


// Create a new Authority
exports.createAuthority = async (req, res) => {
    try {
        const { district, block, locality, officialEmail } = req.body;
        const newAuthority = new Authority({ location: { district, block, locality }, officialEmail });
        await newAuthority.save();
        res.status(201).json({ message: "Authority created successfully.", authority: newAuthority });
    } catch (error) {
        res.status(500).json({ message: "Server error creating authority." });
    }
};

// Get all Authorities
exports.getAllAuthorities = async (req, res) => {
    try {
        const authorities = await Authority.find({}).sort('location.district');
        res.status(200).json({ authorities });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching authorities." });
    }
};

// Delete an Authority
exports.deleteAuthority = async (req, res) => {
    try {
        const { authorityId } = req.params;
        const deletedAuthority = await Authority.findByIdAndDelete(authorityId);
        if (!deletedAuthority) {
            return res.status(404).json({ message: "Authority not found." });
        }
        res.status(200).json({ message: "Authority deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting authority." });
    }
};