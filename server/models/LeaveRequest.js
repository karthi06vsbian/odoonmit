const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  leave_type: {
    type: DataTypes.ENUM('Paid', 'Sick', 'Unpaid'),
    allowNull: false,
    defaultValue: 'Paid'
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  days_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
    allowNull: false
  },
  admin_comment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'LeaveRequests'
});

module.exports = LeaveRequest;
