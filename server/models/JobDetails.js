const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const JobDetails = sequelize.define('JobDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING,
    defaultValue: 'Software Engineer',
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'Engineering',
    allowNull: false
  },
  joining_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  employment_type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship'),
    defaultValue: 'Full-time'
  }
}, {
  timestamps: true,
  tableName: 'JobDetails'
});

module.exports = JobDetails;
