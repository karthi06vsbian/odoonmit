const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userController = require('../controllers/userController');
const { verifyToken, isAdmin, isHRorSelf } = require('../middleware/auth');

// Setup multer storage
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg/png) and documents (pdf/doc/docx) are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.get('/profile', verifyToken, (req, res, next) => {
  req.params.id = req.user.id;
  userController.getProfile(req, res, next);
});
router.get('/profile/:id', verifyToken, isHRorSelf, userController.getProfile);
router.put('/profile/:id', verifyToken, isHRorSelf, userController.updateProfile);

// Upload Endpoint
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = `uploads/${req.file.filename}`;
    return res.status(200).json({
      message: 'File uploaded successfully',
      filePath: filePath
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
