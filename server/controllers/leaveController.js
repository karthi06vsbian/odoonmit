const { LeaveRequest, User, Notification, JobDetails } = require('../models');

exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leave_type, start_date, end_date, remarks } = req.body;

    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ message: 'leave_type, start_date, and end_date are required' });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date' });
    }

    const leave = await LeaveRequest.create({
      user_id: userId,
      leave_type,
      start_date,
      end_date,
      remarks,
      status: 'Pending',
      applied_at: new Date()
    });

    // Notify HR users
    const hrUsers = await User.findAll({ where: { role: 'HR' } });
    const notificationPromises = hrUsers.map(hr => {
      return Notification.create({
        user_id: hr.id,
        message: `${req.user.name} applied for a ${leave_type} Leave from ${start_date} to ${end_date}.`,
        type: 'Leave Application',
        is_read: false
      });
    });
    await Promise.all(notificationPromises);

    return res.status(201).json({
      message: 'Leave application submitted successfully',
      leave
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await LeaveRequest.findAll({
      where: { user_id: userId },
      order: [['applied_at', 'DESC']]
    });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Get my leaves error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'employee_id', 'email'],
          include: [{ model: JobDetails, as: 'jobDetails', attributes: ['designation', 'department'] }]
        }
      ],
      order: [['applied_at', 'DESC']]
    });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Get all leaves error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.reviewLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_comment } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected' });
    }

    const leave = await LeaveRequest.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status;
    leave.admin_comment = admin_comment || '';
    await leave.save();

    // Notify the employee
    await Notification.create({
      user_id: leave.user_id,
      message: `Your leave request for ${leave.leave_type} Leave (${leave.start_date} to ${leave.end_date}) has been ${status}. Comment: ${admin_comment || 'No comments'}`,
      type: 'Leave Update',
      is_read: false
    });

    return res.status(200).json({
      message: `Leave request status updated to ${status}`,
      leave
    });
  } catch (error) {
    console.error('Review leave error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
