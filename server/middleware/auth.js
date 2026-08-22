const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'dayflow_hrms_super_secret_jwt_key_2026');
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Session expired or invalid token. Please log in again.' });
  }
};

const isHR = (req, res, next) => {
  if (req.user && (req.user.role === 'HR' || req.user.role === 'Admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: HR Admin privileges required.' });
  }
};

const isSelfOrHR = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  if (req.user && (req.user.role === 'HR' || req.user.role === 'Admin' || req.user.id === requestedUserId)) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: You cannot access other users records.' });
  }
};

module.exports = {
  verifyToken,
  isHR,
  isSelfOrHR
};
