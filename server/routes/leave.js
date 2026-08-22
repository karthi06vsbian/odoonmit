const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, isHR } = require('../middleware/auth');

router.post('/apply', verifyToken, leaveController.applyLeave);
router.get('/my-leaves', verifyToken, leaveController.getMyLeaves);
router.get('/all', verifyToken, isHR, leaveController.getAllLeaves);
router.put('/:id/review', verifyToken, isHR, leaveController.reviewLeave);

module.exports = router;
