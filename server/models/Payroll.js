const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payroll = sequelize.define('Payroll', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  basic_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5000.00
  },
  allowances: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 500.00
  },
  deductions: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 200.00
  },
  net_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5300.00
  },
  payment_status: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Processing'),
    defaultValue: 'Paid'
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'Payrolls'
});

module.exports = Payroll;
