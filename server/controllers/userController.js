const { User, JobDetails, Payroll } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash', 'otp'] },
      include: [
        { model: JobDetails, as: 'jobDetails' },
        { model: Payroll, as: 'payroll', limit: 1, order: [['id', 'DESC']] }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const userToUpdate = await User.findByPk(userId, {
      include: [{ model: JobDetails, as: 'jobDetails' }]
    });

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role, phone, address, profile_pic, designation, department, joining_date, employment_type } = req.body;

    // Check permissions
    const isSelf = req.user.id === userToUpdate.id;
    const isHR = req.user.role === 'HR';

    if (!isHR && !isSelf) {
      return res.status(403).json({ message: 'Access Denied: You cannot update this profile' });
    }

    if (isHR) {
      // HR can edit all fields
      if (name) userToUpdate.name = name;
      if (email) userToUpdate.email = email;
      if (role) userToUpdate.role = role;
      if (phone !== undefined) userToUpdate.phone = phone;
      if (address !== undefined) userToUpdate.address = address;
      if (profile_pic !== undefined) userToUpdate.profile_pic = profile_pic;

      await userToUpdate.save();

      // HR can also edit job details
      let jobDetails = userToUpdate.jobDetails;
      if (!jobDetails) {
        jobDetails = await JobDetails.create({ user_id: userToUpdate.id });
      }

      if (designation) jobDetails.designation = designation;
      if (department) jobDetails.department = department;
      if (joining_date) jobDetails.joining_date = joining_date;
      if (employment_type) jobDetails.employment_type = employment_type;

      await jobDetails.save();
    } else {
      // Employee can ONLY edit phone, address, and profile_pic
      if (phone !== undefined) userToUpdate.phone = phone;
      if (address !== undefined) userToUpdate.address = address;
      if (profile_pic !== undefined) userToUpdate.profile_pic = profile_pic;

      await userToUpdate.save();
    }

    // Return updated user profile
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash', 'otp'] },
      include: [
        { model: JobDetails, as: 'jobDetails' },
        { model: Payroll, as: 'payroll', limit: 1, order: [['id', 'DESC']] }
      ]
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash', 'otp'] },
      include: [{ model: JobDetails, as: 'jobDetails' }]
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
