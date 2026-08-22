const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/check-in', verifyToken, attendanceController.checkIn);
router.post('/check-out', verifyToken, attendanceController.checkOut);
router.get('/my-attendance', verifyToken, attendanceController.getMyAttendance);
router.get('/all', verifyToken, isAdmin, attendanceController.getAllAttendance);

module.exports = router;
