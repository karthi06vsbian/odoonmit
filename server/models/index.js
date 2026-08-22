const User = require('./User');
const JobDetails = require('./JobDetails');
const Attendance = require('./Attendance');
const LeaveRequest = require('./LeaveRequest');
const Payroll = require('./Payroll');
const Notification = require('./Notification');

// Define associations
User.hasOne(JobDetails, { foreignKey: 'user_id', as: 'jobDetails', onDelete: 'CASCADE' });
JobDetails.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Attendance, { foreignKey: 'user_id', as: 'attendance', onDelete: 'CASCADE' });
Attendance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(LeaveRequest, { foreignKey: 'user_id', as: 'leaveRequests', onDelete: 'CASCADE' });
LeaveRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Payroll, { foreignKey: 'user_id', as: 'payroll', onDelete: 'CASCADE' });
Payroll.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  User,
  JobDetails,
  Attendance,
  LeaveRequest,
  Payroll,
  Notification
};
