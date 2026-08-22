const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, isHR } = require('../middleware/auth');

router.post('/check-in', verifyToken, attendanceController.checkIn);
router.post('/check-out', verifyToken, attendanceController.checkOut);
router.get('/today', verifyToken, attendanceController.getTodayStatus);
router.get('/my-history', verifyToken, attendanceController.getMyAttendance);
router.get('/all', verifyToken, isHR, attendanceController.getAllAttendance);

module.exports = router;
