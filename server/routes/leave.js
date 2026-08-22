const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/apply', verifyToken, leaveController.applyLeave);
router.get('/my-leaves', verifyToken, leaveController.getMyLeaves);
router.get('/all', verifyToken, isAdmin, leaveController.getAllLeaves);
router.put('/review/:id', verifyToken, isAdmin, leaveController.reviewLeave);

module.exports = router;
