const { Op } = require('sequelize');
const { Attendance, User, JobDetails, Notification } = require('../models');

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    let record = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    if (record && record.check_in) {
      return res.status(400).json({
        message: 'You have already checked in today at ' + new Date(record.check_in).toLocaleTimeString(),
        attendance: record
      });
    }

    const now = new Date();
    if (!record) {
      record = await Attendance.create({
        user_id: userId,
        date: today,
        check_in: now,
        status: 'Present',
        notes: req.body.notes || 'Checked in via web portal'
      });
    } else {
      record.check_in = now;
      record.status = 'Present';
      await record.save();
    }

    return res.status(200).json({
      message: 'Checked in successfully at ' + now.toLocaleTimeString(),
      attendance: record
    });
  } catch (error) {
    console.error('Check-in error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const record = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    if (!record || !record.check_in) {
      return res.status(400).json({ message: 'You have not checked in yet today' });
    }

    if (record.check_out) {
      return res.status(400).json({
        message: 'You have already checked out today at ' + new Date(record.check_out).toLocaleTimeString(),
        attendance: record
      });
    }

    const now = new Date();
    record.check_out = now;

    // Calculate total hours
    const diffMs = now.getTime() - new Date(record.check_in).getTime();
    const diffHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    record.total_hours = diffHours;

    // Determine status based on duration
    if (diffHours >= 8.0) {
      record.status = 'Present';
    } else if (diffHours >= 4.0) {
      record.status = 'Half-day';
    } else {
      record.status = 'Absent';
    }

    if (req.body.notes) {
      record.notes = record.notes ? `${record.notes} | ${req.body.notes}` : req.body.notes;
    }

    await record.save();

    return res.status(200).json({
      message: `Checked out successfully. Total Work Duration: ${diffHours} hrs (${record.status})`,
      attendance: record
    });
  } catch (error) {
    console.error('Check-out error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const record = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    return res.status(200).json({
      date: today,
      isCheckedIn: Boolean(record && record.check_in),
      isCheckedOut: Boolean(record && record.check_out),
      attendance: record || null
    });
  } catch (error) {
    console.error('Get today status error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit } = req.query;
    const where = { user_id: userId };

    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const records = await Attendance.findAll({
      where,
      order: [['date', 'DESC']],
      limit: limit ? parseInt(limit, 10) : 30
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error('Get my attendance error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { date, status, department, search } = req.query;
    const where = {};

    if (date) {
      where.date = date;
    }

    if (status) {
      where.status = status;
    }

    const userWhere = {};
    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { employee_id: { [Op.like]: `%${search}%` } }
      ];
    }

    const jobWhere = {};
    if (department) {
      jobWhere.department = department;
    }

    const records = await Attendance.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
          attributes: ['id', 'name', 'employee_id', 'email', 'profile_pic'],
          include: [
            {
              model: JobDetails,
              as: 'jobDetails',
              where: Object.keys(jobWhere).length > 0 ? jobWhere : undefined,
              attributes: ['designation', 'department']
            }
          ]
        }
      ],
      order: [['date', 'DESC'], ['check_in', 'DESC']]
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error('Get all attendance error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
