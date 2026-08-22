const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, JobDetails } = require('../models');
require('dotenv').config();

// Password rules: min 8 chars, at least 1 uppercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, employee_id: user.employee_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '1h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { employee_id, name, email, password, role } = req.body;

    if (!employee_id || !name || !email || !password) {
      return res.status(400).json({ message: 'All fields (employee_id, name, email, password) are required' });
    }

    // Validate email domain or format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address format' });
    }

    // Validate password rules
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const existingEmpId = await User.findOne({ where: { employee_id } });
    if (existingEmpId) {
      return res.status(400).json({ message: 'Employee ID is already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create unverified user
    const newUser = await User.create({
      employee_id,
      name,
      email,
      password_hash,
      role: role === 'HR' ? 'HR' : 'Employee',
      otp,
      is_verified: false
    });

    // Log the OTP to the console for development testing
    console.log('\n==============================================');
    console.log(`[EMAIL SIMULATOR] Verification OTP for ${email}: ${otp}`);
    console.log(`[EMAIL SIMULATOR] Copy and paste this OTP in the application to verify.`);
    console.log('==============================================\n');

    return res.status(201).json({
      message: 'Registration successful! Please check your email (or server logs) for the OTP verification code.',
      email: email
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code. Please try again.' });
    }

    // Verify user and clear OTP
    user.is_verified = true;
    user.otp = null;
    await user.save();

    // Initialize job details
    await JobDetails.create({
      user_id: user.id,
      designation: user.role === 'HR' ? 'HR Specialist' : 'Software Engineer',
      department: user.role === 'HR' ? 'Human Resources' : 'Engineering',
      joining_date: new Date().toISOString().split('T')[0],
      employment_type: 'Full-time'
    });

    return res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

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

    if (!user.is_verified) {
      return res.status(403).json({
        message: 'Your email is not verified yet. Please verify it using your OTP.',
        needs_verification: true,
        email: user.email
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT tokens
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
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newAccessToken = generateAccessToken(user);
      return res.status(200).json({
        accessToken: newAccessToken
      });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
