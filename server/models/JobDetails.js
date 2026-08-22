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
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  designation: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Intern'
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'General'
  },
  joining_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  employment_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Full-time'
  }
}, {
  tableName: 'job_details',
  timestamps: false
});

module.exports = JobDetails;
