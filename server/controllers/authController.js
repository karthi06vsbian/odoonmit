const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, JobDetails, Notification } = require('../models');
require('dotenv').config();

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, employee_id: user.employee_id, name: user.name },
    process.env.JWT_SECRET || 'dayflow_hrms_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRY || '2h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'dayflow_hrms_super_refresh_secret_key_2026',
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { employee_id, name, email, password, role } = req.body;

    if (!employee_id || !name || !email || !password) {
      return res.status(400).json({ message: 'All fields (Employee ID, Name, Email, Password) are required.' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.'
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { employee_id }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'An account with this email address already exists.' });
      }
      if (existingUser.employee_id === employee_id) {
        return res.status(400).json({ message: 'This Employee ID is already registered.' });
      }
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate 6-digit OTP for verification simulation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      employee_id,
      name,
      email,
      password_hash,
      role: role === 'HR' ? 'HR' : 'Employee',
      is_verified: true, // Auto-verified for seamless testing
      otp
    });

    await JobDetails.create({
      user_id: newUser.id,
      designation: newUser.role === 'HR' ? 'HR Officer' : 'Software Engineer',
      department: newUser.role === 'HR' ? 'Human Resources' : 'Engineering',
      joining_date: new Date().toISOString().split('T')[0],
      employment_type: 'Full-time'
    });

    return res.status(201).json({
      message: 'Account created successfully! You can now log in.',
      email: newUser.email,
      otp: newUser.otp
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error: ' + error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(200).json({ message: 'Account is already verified. Please sign in.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid verification code. Please try again.' });
    }

    user.is_verified = true;
    user.otp = null;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully! You can now sign in.' });
  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email or Employee ID and password are required' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { employee_id: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/Employee ID or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email/Employee ID or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profile_pic: user.profile_pic
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error: ' + error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'dayflow_hrms_super_refresh_secret_key_2026',
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const newAccessToken = generateAccessToken(user);
        return res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error('Token refresh error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash', 'otp'] },
      include: [{ model: JobDetails, as: 'jobDetails' }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get me error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
