const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/my-payroll', verifyToken, payrollController.getMyPayroll);
router.get('/all', verifyToken, isAdmin, payrollController.getAllPayroll);
router.post('/update', verifyToken, isAdmin, payrollController.updatePayroll);
router.get('/download/:id', verifyToken, payrollController.downloadPayslip);

module.exports = router;
