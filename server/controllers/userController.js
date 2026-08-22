const { Op } = require('sequelize');
const { User, JobDetails, Payroll } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const { search, department, role } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { employee_id: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (role) {
      where.role = role;
    }

    const jobWhere = {};
    if (department) {
      jobWhere.department = department;
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password_hash', 'otp'] },
      include: [
        {
          model: JobDetails,
          as: 'jobDetails',
          where: Object.keys(jobWhere).length > 0 ? jobWhere : undefined,
          required: false
        }
      ],
      order: [['name', 'ASC']]
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash', 'otp'] },
      include: [
        { model: JobDetails, as: 'jobDetails' },
        { model: Payroll, as: 'payroll', limit: 1, order: [['id', 'DESC']] }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user by id error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const isHR = req.user.role === 'HR' || req.user.role === 'Admin';
    const isSelf = req.user.id === parseInt(userId, 10);

    if (!isHR && !isSelf) {
      return res.status(403).json({ message: 'Forbidden: You cannot modify other user profiles' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, phone, address, role, jobDetails } = req.body;

    // Fields editable by self: phone, address
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    // Fields editable only by HR
    if (isHR) {
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;

      if (jobDetails) {
        let job = await JobDetails.findOne({ where: { user_id: user.id } });
        if (!job) {
          job = await JobDetails.create({ user_id: user.id });
        }
        if (jobDetails.designation) job.designation = jobDetails.designation;
        if (jobDetails.department) job.department = jobDetails.department;
        if (jobDetails.joining_date) job.joining_date = jobDetails.joining_date;
        if (jobDetails.employment_type) job.employment_type = jobDetails.employment_type;
        await job.save();
      }
    }

    await user.save();

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
    console.error('Update profile error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const isHR = req.user.role === 'HR' || req.user.role === 'Admin';
    const isSelf = req.user.id === parseInt(userId, 10);

    if (!isHR && !isSelf) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile_pic = req.file.path;
    await user.save();

    return res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profile_pic: user.profile_pic
    });
  } catch (error) {
    console.error('Avatar upload error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
