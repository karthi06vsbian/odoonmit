const { Op } = require('sequelize');
const { LeaveRequest, User, JobDetails, Notification } = require('../models');

exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leave_type, start_date, end_date, reason } = req.body;

    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ message: 'Leave type, start date, and end date are required' });
    }

    // Calculate days count
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date' });
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    const leave = await LeaveRequest.create({
      user_id: userId,
      leave_type,
      start_date,
      end_date,
      days_count: diffDays,
      reason,
      status: 'Pending'
    });

    // Notify HR
    const hrUsers = await User.findAll({ where: { role: 'HR' } });
    for (const hr of hrUsers) {
      await Notification.create({
        user_id: hr.id,
        title: 'New Leave Application',
        message: `${req.user.name} submitted a ${leave_type} leave request (${diffDays} days) from ${start_date} to ${end_date}.`,
        type: 'leave'
      });
    }

    return res.status(201).json({
      message: 'Leave application submitted successfully. Awaiting HR approval.',
      leave
    });
  } catch (error) {
    console.error('Apply leave error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await LeaveRequest.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Get my leaves error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const { status, leave_type } = req.query;
    const where = {};

    if (status) where.status = status;
    if (leave_type) where.leave_type = leave_type;

    const leaves = await LeaveRequest.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'employee_id', 'email', 'profile_pic'],
          include: [{ model: JobDetails, as: 'jobDetails', attributes: ['designation', 'department'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Get all leaves error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.reviewLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status, admin_comment } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either "Approved" or "Rejected"' });
    }

    const leave = await LeaveRequest.findByPk(leaveId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status;
    leave.admin_comment = admin_comment || null;
    leave.approved_by = req.user.id;
    await leave.save();

    // Create notification for applicant
    await Notification.create({
      user_id: leave.user_id,
      title: `Leave Request ${status}`,
      message: `Your ${leave.leave_type} leave request (${leave.start_date} to ${leave.end_date}) has been ${status.toLowerCase()}.${admin_comment ? ` Remarks: "${admin_comment}"` : ''}`,
      type: 'leave'
    });

    return res.status(200).json({
      message: `Leave request has been marked as ${status}`,
      leave
    });
  } catch (error) {
    console.error('Review leave error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
