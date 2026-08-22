const PDFDocument = require('pdfkit');
const { Payroll, User, JobDetails } = require('../models');

exports.getMyPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const slips = await Payroll.findAll({
      where: { user_id: userId },
      order: [['year', 'DESC'], ['month', 'DESC']]
    });

    return res.status(200).json(slips);
  } catch (error) {
    console.error('Get my payroll error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllPayroll = async (req, res) => {
  try {
    const { month, year, search } = req.query;
    const where = {};

    if (month) where.month = month;
    if (year) where.year = year;

    const payrolls = await Payroll.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'employee_id', 'email', 'profile_pic'],
          include: [{ model: JobDetails, as: 'jobDetails', attributes: ['designation', 'department'] }]
        }
      ],
      order: [['year', 'DESC'], ['month', 'DESC']]
    });

    return res.status(200).json(payrolls);
  } catch (error) {
    console.error('Get all payroll error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateSalaryStructure = async (req, res) => {
  try {
    const { user_id, month, year, basic_salary, allowances, deductions, payment_status } = req.body;

    if (!user_id || basic_salary === undefined) {
      return res.status(400).json({ message: 'User ID and Basic Salary are required' });
    }

    const basic = parseFloat(basic_salary) || 0;
    const allow = parseFloat(allowances) || 0;
    const deduct = parseFloat(deductions) || 0;
    const net = basic + allow - deduct;

    const currentMonth = month || (new Date().getMonth() + 1);
    const currentYear = year || new Date().getFullYear();

    let payroll = await Payroll.findOne({
      where: { user_id, month: currentMonth, year: currentYear }
    });

    if (payroll) {
      payroll.basic_salary = basic;
      payroll.allowances = allow;
      payroll.deductions = deduct;
      payroll.net_salary = net;
      if (payment_status) payroll.payment_status = payment_status;
      await payroll.save();
    } else {
      payroll = await Payroll.create({
        user_id,
        month: currentMonth,
        year: currentYear,
        basic_salary: basic,
        allowances: allow,
        deductions: deduct,
        net_salary: net,
        payment_status: payment_status || 'Paid',
        payment_date: new Date().toISOString().split('T')[0]
      });
    }

    return res.status(200).json({
      message: 'Salary structure updated successfully',
      payroll
    });
  } catch (error) {
    console.error('Update salary error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.downloadPayslipPDF = async (req, res) => {
  try {
    const slipId = req.params.id;
    const slip = await Payroll.findByPk(slipId, {
      include: [
        {
          model: User,
          as: 'user',
          include: [{ model: JobDetails, as: 'jobDetails' }]
        }
      ]
    });

    if (!slip) {
      return res.status(404).json({ message: 'Payslip record not found' });
    }

    // Role check: HR or Self
    if (req.user.role !== 'HR' && req.user.role !== 'Admin' && req.user.id !== slip.user_id) {
      return res.status(403).json({ message: 'Forbidden: You cannot view other payslips' });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Payslip_${slip.user.employee_id}_${slip.month}_${slip.year}.pdf`
    );

    doc.pipe(res);

    // Header Branding
    doc.fontSize(22).fillColor('#1E3A8A').text('DAYFLOW HRMS', { align: 'center' });
    doc.fontSize(10).fillColor('#64748B').text('Every workday, perfectly aligned.', { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(14).fillColor('#0F172A').text(`PAYSLIP - ${getMonthName(slip.month).toUpperCase()} ${slip.year}`, { align: 'center' });
    doc.moveDown(1);

    doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Employee Information Block
    const leftX = 50;
    const rightX = 320;
    const startY = doc.y;

    doc.fontSize(10).fillColor('#334155');
    doc.text(`Employee Name: `, leftX, startY, { continued: true }).font('Helvetica-Bold').text(`${slip.user.name}`);
    doc.font('Helvetica').text(`Employee ID: `, leftX, doc.y + 5, { continued: true }).font('Helvetica-Bold').text(`${slip.user.employee_id}`);
    doc.font('Helvetica').text(`Email: `, leftX, doc.y + 5, { continued: true }).font('Helvetica-Bold').text(`${slip.user.email}`);

    doc.font('Helvetica').text(`Designation: `, rightX, startY, { continued: true }).font('Helvetica-Bold').text(`${slip.user.jobDetails?.designation || 'N/A'}`);
    doc.font('Helvetica').text(`Department: `, rightX, doc.y + 5, { continued: true }).font('Helvetica-Bold').text(`${slip.user.jobDetails?.department || 'N/A'}`);
    doc.font('Helvetica').text(`Payment Status: `, rightX, doc.y + 5, { continued: true }).font('Helvetica-Bold').text(`${slip.payment_status}`);

    doc.moveDown(2.5);
    doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Salary Table
    doc.fontSize(12).fillColor('#1E3A8A').text('Earnings & Deductions Breakdown', 50, doc.y);
    doc.moveDown(0.5);

    const tableTop = doc.y;
    doc.fontSize(10).fillColor('#475569');
    doc.text('Description', 60, tableTop);
    doc.text('Amount (USD)', 420, tableTop, { align: 'right' });

    doc.moveDown(0.5);
    doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Rows
    const items = [
      { label: 'Basic Salary', amount: `+$${parseFloat(slip.basic_salary).toFixed(2)}` },
      { label: 'Allowances & Bonuses', amount: `+$${parseFloat(slip.allowances).toFixed(2)}` },
      { label: 'Statutory Deductions & Taxes', amount: `-$${parseFloat(slip.deductions).toFixed(2)}` }
    ];

    items.forEach((item) => {
      const y = doc.y;
      doc.fillColor('#1E293B').text(item.label, 60, y);
      doc.text(item.amount, 420, y, { align: 'right' });
      doc.moveDown(0.5);
    });

    doc.strokeColor('#1E3A8A').lineWidth(1.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);

    // Net Salary
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0F172A').text('NET PAYABLE SALARY', 60, doc.y);
    doc.text(`$${parseFloat(slip.net_salary).toFixed(2)}`, 420, doc.y - 12, { align: 'right' });

    doc.moveDown(4);
    doc.fontSize(8).font('Helvetica').fillColor('#94A3B8').text('This is a computer-generated document from Dayflow HRMS. No physical signature is required.', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Download payslip error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('en-US', { month: 'long' });
}
