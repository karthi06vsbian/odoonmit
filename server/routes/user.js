const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const { verifyToken, isHR, isSelfOrHR } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, isSelfOrHR, userController.getUserById);
router.put('/:id', verifyToken, isSelfOrHR, userController.updateUserProfile);
router.post('/:id/avatar', verifyToken, isSelfOrHR, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;
