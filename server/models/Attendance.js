const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  check_in: {
    type: DataTypes.DATE,
    allowNull: true
  },
  check_out: {
    type: DataTypes.DATE,
    allowNull: true
  },
  total_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Half-day', 'Leave'),
    defaultValue: 'Present'
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'Attendances'
});

module.exports = Attendance;
