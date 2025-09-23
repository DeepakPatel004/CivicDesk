const express = require('express');
const router = express.Router();

// Import the security middleware
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { isSuperAdmin } = require('../middleware/permissionsMiddleware'); // Import the new role checker

// Import the controller functions
const { 
    login, 
    getReports, 
    registerEmployee, 
    updateReportStatus,
    getAllEmployees,      
    updateEmployeeStatus,
    getHeatmapData,         
    getReportById,          
    createAuthority,        
    getAllAuthorities,      
    deleteAuthority
} = require('../controllers/adminController');

// --- PUBLIC ROUTE ---
router.post('/login', login);

// --- PROTECTED ROUTES (All Employees) ---
router.get('/reports', adminAuthMiddleware, getReports);
router.get('/reports/:reportId', adminAuthMiddleware, getReportById); // New route for single report view
router.patch('/reports/:reportId/status', adminAuthMiddleware, updateReportStatus);

// --- SUPER ADMIN ONLY ROUTES ---
router.post('/register', adminAuthMiddleware, isSuperAdmin, registerEmployee);
router.get('/employees', adminAuthMiddleware, isSuperAdmin, getAllEmployees);
router.patch('/employees/:employeeId/status', adminAuthMiddleware, isSuperAdmin, updateEmployeeStatus);

// New Analytics Route (Super Admin Only)
router.get('/heatmap', adminAuthMiddleware, isSuperAdmin, getHeatmapData);

// New Authority Management Routes (Super Admin Only)
router.post('/authorities', adminAuthMiddleware, isSuperAdmin, createAuthority);
router.get('/authorities', adminAuthMiddleware, isSuperAdmin, getAllAuthorities);
router.delete('/authorities/:authorityId', adminAuthMiddleware, isSuperAdmin, deleteAuthority);

module.exports = router;