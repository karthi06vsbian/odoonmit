const { Attendance, LeaveRequest, User, JobDetails } = require('../models');
const { Op } = require('sequelize');

// Helper to get dates in range
const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let curr = new Date(startDate);
  const end = new Date(endDate);
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if on approved leave today
    const approvedLeave = await LeaveRequest.findOne({
      where: {
        user_id: userId,
        status: 'Approved',
        start_date: { [Op.lte]: todayStr },
        end_date: { [Op.gte]: todayStr }
      }
    });

    if (approvedLeave) {
      return res.status(400).json({ message: 'You have an approved leave for today. Check-in is not allowed.' });
    }

    // Check if already checked in today
    const existingRecord = await Attendance.findOne({
      where: {
        user_id: userId,
        date: todayStr
      }
    });

    if (existingRecord) {
      return res.status(400).json({ message: 'You have already checked in today' });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      user_id: userId,
      date: todayStr,
      check_in: new Date(),
      status: 'Present' // Default to present upon checking in
    });

    return res.status(200).json({
      message: 'Checked in successfully',
      attendance
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];

    // Find attendance record for today
    const attendance = await Attendance.findOne({
      where: {
        user_id: userId,
        date: todayStr
      }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'You must check-in first before checking out' });
    }

    if (attendance.check_out) {
      return res.status(400).json({ message: 'You have already checked out today' });
    }

    const checkOutTime = new Date();
    attendance.check_out = checkOutTime;

    // Calculate hours worked
    const checkInTime = new Date(attendance.check_in);
    const diffMs = checkOutTime - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);

    // If hours < 4, status is 'Half-day', otherwise 'Present'
    if (diffHours < 4) {
      attendance.status = 'Half-day';
    } else {
      attendance.status = 'Present';
    }

    await attendance.save();

    return res.status(200).json({
      message: `Checked out successfully. Work duration: ${diffHours.toFixed(2)} hours.`,
      attendance
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'start_date and end_date query parameters are required' });
    }

    // Fetch existing attendance records
    const attendanceRecords = await Attendance.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [start_date, end_date]
        }
      }
    });

    // Fetch approved leave requests that overlap with the date range
    const leaveRequests = await LeaveRequest.findAll({
      where: {
        user_id: userId,
        status: 'Approved',
        [Op.or]: [
          { start_date: { [Op.between]: [start_date, end_date] } },
          { end_date: { [Op.between]: [start_date, end_date] } },
          {
            start_date: { [Op.lte]: start_date },
            end_date: { [Op.gte]: end_date }
          }
        ]
      }
    });

    const attendanceMap = new Map();
    attendanceRecords.forEach(r => attendanceMap.set(r.date, r));

    const dateList = getDatesInRange(start_date, end_date);
    const todayStr = new Date().toISOString().split('T')[0];

    const filledRecords = dateList.map(dateStr => {
      // 1. If we have a recorded check-in/out
      if (attendanceMap.has(dateStr)) {
        return attendanceMap.get(dateStr);
      }

      // 2. Check if this date has an approved leave
      const isOnLeave = leaveRequests.some(l => dateStr >= l.start_date && dateStr <= l.end_date);
      if (isOnLeave) {
        return {
          user_id: userId,
          date: dateStr,
          check_in: null,
          check_out: null,
          status: 'Leave'
        };
      }

      // 3. For past weekdays (Mon-Fri), set as Absent if no check-in
      const dateObj = new Date(dateStr);
      const isPast = dateStr < todayStr;
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // Sun=0, Sat=6

      if (isPast && !isWeekend) {
        return {
          user_id: userId,
          date: dateStr,
          check_in: null,
          check_out: null,
          status: 'Absent'
        };
      }

      // 4. Default for future or weekends with no activity
      return {
        user_id: userId,
        date: dateStr,
        check_in: null,
        check_out: null,
        status: isWeekend ? 'Weekend' : 'Absent' // 'Absent' for weekday future days before clocking
      };
    });

    return res.status(200).json(filledRecords);
  } catch (error) {
    console.error('Get my attendance error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'date query parameter is required (YYYY-MM-DD)' });
    }

    // Get all users
    const users = await User.findAll({
      attributes: ['id', 'name', 'employee_id', 'role'],
      include: [{ model: JobDetails, as: 'jobDetails', attributes: ['designation', 'department'] }]
    });

    // Get attendance for the date
    const attendanceRecords = await Attendance.findAll({
      where: { date }
    });

    // Get approved leaves for the date
    const leaveRequests = await LeaveRequest.findAll({
      where: {
        status: 'Approved',
        start_date: { [Op.lte]: date },
        end_date: { [Op.gte]: date }
      }
    });

    const attendanceMap = new Map();
    attendanceRecords.forEach(r => attendanceMap.set(r.user_id, r));

    const leaveUserIds = new Set(leaveRequests.map(l => l.user_id));

    const results = users.map(user => {
      const job = user.jobDetails || {};
      const record = attendanceMap.get(user.id);
      
      let status = 'Absent';
      let check_in = null;
      let check_out = null;

      if (record) {
        status = record.status;
        check_in = record.check_in;
        check_out = record.check_out;
      } else if (leaveUserIds.has(user.id)) {
        status = 'Leave';
      } else {
        const dateObj = new Date(date);
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
        if (isWeekend) {
          status = 'Weekend';
        }
      }

      return {
        user_id: user.id,
        employee_id: user.employee_id,
        name: user.name,
        role: user.role,
        department: job.department || 'N/A',
        designation: job.designation || 'N/A',
        date,
        check_in,
        check_out,
        status
      };
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error('Get all attendance error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
