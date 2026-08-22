const PDFDocument = require('pdfkit');
const { Payroll, User, JobDetails, Notification } = require('../models');

exports.getMyPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Payroll.findAll({
      where: { user_id: userId },
      order: [['year', 'DESC'], ['month', 'DESC']]
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error('Get my payroll error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllPayroll = async (req, res) => {
  try {
    const records = await Payroll.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'employee_id', 'email'],
          include: [{ model: JobDetails, as: 'jobDetails', attributes: ['designation', 'department'] }]
        }
      ],
      order: [['year', 'DESC'], ['month', 'DESC']]
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error('Get all payroll error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updatePayroll = async (req, res) => {
  try {
    const { user_id, basic_salary, allowances, deductions, month, year } = req.body;

    if (!user_id || basic_salary === undefined || allowances === undefined || deductions === undefined || !month || !year) {
      return res.status(400).json({ message: 'All fields (user_id, basic_salary, allowances, deductions, month, year) are required' });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Employee user not found' });
    }

    const net_salary = parseFloat(basic_salary) + parseFloat(allowances) - parseFloat(deductions);

    // Find if a record already exists for this employee for this month/year
    let record = await Payroll.findOne({
      where: { user_id, month, year }
    });

    if (record) {
      record.basic_salary = basic_salary;
      record.allowances = allowances;
      record.deductions = deductions;
      record.net_salary = net_salary;
      await record.save();
    } else {
      record = await Payroll.create({
        user_id,
        basic_salary,
        allowances,
        deductions,
        net_salary,
        month,
        year
      });
    }

    // Get month name
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1] || month;

    // Create notification for employee
    await Notification.create({
      user_id,
      message: `Your payroll for ${monthName} ${year} has been updated. Net Salary: $${net_salary.toFixed(2)}.`,
      type: 'Payroll Update',
      is_read: false
    });

    return res.status(200).json({
      message: 'Payroll record updated successfully',
      payroll: record
    });
  } catch (error) {
    console.error('Update payroll error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.downloadPayslip = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Payroll.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'employee_id', 'email', 'phone', 'address'],
          include: [{ model: JobDetails, as: 'jobDetails', attributes: ['designation', 'department', 'joining_date'] }]
        }
      ]
    });

    if (!record) {
      return res.status(404).json({ message: 'Payslip record not found' });
    }

    // Security Check: Employee can only download their own payslip
    if (req.user.role !== 'HR' && req.user.id !== record.user_id) {
      return res.status(403).json({ message: 'Access Denied: You cannot view other employees slips' });
    }

    const { user } = record;
    const job = user.jobDetails || {};

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[record.month - 1] || record.month;

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Stream PDF directly to client response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip-${user.employee_id}-${monthName}-${record.year}.pdf`);
    doc.pipe(res);

    // Add Company Info / Title
    doc.fillColor('#1E293B').fontSize(24).text('Dayflow HRMS', { align: 'center' });
    doc.fontSize(10).fillColor('#64748B').text('Every workday, perfectly aligned.', { align: 'center' });
    doc.moveDown(1.5);

    // Title Section
    doc.fillColor('#1E3A8A').fontSize(16).text(`SALARY SLIP - ${monthName.toUpperCase()} ${record.year}`, { align: 'center', underline: true });
    doc.moveDown(2);

    // Employee details section
    doc.fillColor('#334155').fontSize(11);
    doc.text(`Employee Name: ${user.name}`, 50, 150);
    doc.text(`Employee ID: ${user.employee_id}`, 50, 168);
    doc.text(`Email: ${user.email}`, 50, 186);

    doc.text(`Department: ${job.department || 'N/A'}`, 320, 150);
    doc.text(`Designation: ${job.designation || 'N/A'}`, 320, 168);
    doc.text(`Joining Date: ${job.joining_date || 'N/A'}`, 320, 186);

    // Separator line
    doc.moveTo(50, 210).lineTo(550, 210).strokeColor('#CBD5E1').stroke();
    doc.moveDown(2);

    // Salary Structure Header
    doc.fillColor('#1E3A8A').fontSize(12).text('Salary Structure Details', 50, 230);
    doc.moveDown(0.5);

    // Table Header
    doc.rect(50, 250, 500, 25).fill('#F1F5F9');
    doc.fillColor('#1E293B').fontSize(10);
    doc.text('Description', 60, 258);
    doc.text('Earnings ($)', 280, 258);
    doc.text('Deductions ($)', 430, 258);

    // Row 1: Basic Salary
    doc.text('Basic Salary', 60, 288);
    doc.text(parseFloat(record.basic_salary).toFixed(2), 280, 288);
    doc.text('-', 430, 288);

    // Row 2: Allowances
    doc.text('Allowances', 60, 312);
    doc.text(parseFloat(record.allowances).toFixed(2), 280, 312);
    doc.text('-', 430, 312);

    // Row 3: Deductions
    doc.text('Deductions', 60, 336);
    doc.text('-', 280, 336);
    doc.text(parseFloat(record.deductions).toFixed(2), 430, 336);

    // Separator
    doc.moveTo(50, 360).lineTo(550, 360).strokeColor('#E2E8F0').stroke();

    // Summary section
    doc.rect(50, 380, 500, 40).fill('#EFF6FF');
    doc.fillColor('#1E3A8A').fontSize(12);
    doc.text('NET SALARY PAYABLE:', 60, 394);
    doc.text(`$${parseFloat(record.net_salary).toFixed(2)}`, 380, 394, { align: 'right', width: 150 });

    doc.moveDown(3);

    // Footer signatures
    doc.fillColor('#64748B').fontSize(9);
    doc.text('Employer Signature', 50, 480, { underline: true });
    doc.text('Employee Signature', 400, 480, { underline: true });

    doc.text('This is a system generated payslip and does not require a physical stamp.', 50, 540, { align: 'center' });

    // End Document
    doc.end();
  } catch (error) {
    console.error('Download payslip error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
