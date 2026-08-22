const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { verifyToken, isHR } = require('../middleware/auth');

router.get('/my-slips', verifyToken, payrollController.getMyPayroll);
router.get('/all', verifyToken, isHR, payrollController.getAllPayroll);
router.post('/structure', verifyToken, isHR, payrollController.updateSalaryStructure);
router.get('/payslip/:id/pdf', verifyToken, payrollController.downloadPayslipPDF);

module.exports = router;
