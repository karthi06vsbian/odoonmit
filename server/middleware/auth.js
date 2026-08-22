const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'HR') {
    return res.status(403).json({ message: 'Access Denied: HR/Admin privileges required' });
  }
  next();
};

const isEmployee = (req, res, next) => {
  if (!req.user || req.user.role !== 'Employee') {
    return res.status(403).json({ message: 'Access Denied: Employee privileges required' });
  }
  next();
};

const isHRorSelf = (req, res, next) => {
  const requestedUserId = parseInt(req.params.userId || req.params.id);
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role === 'HR' || req.user.id === requestedUserId) {
    next();
  } else {
    return res.status(403).json({ message: 'Access Denied: You cannot perform this action for other users' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isEmployee,
  isHRorSelf
};
