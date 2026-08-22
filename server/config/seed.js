const bcrypt = require('bcryptjs');
const { User, JobDetails, Attendance, LeaveRequest, Payroll, Notification } = require('../models');

const seedDatabase = async () => {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seeder...');
      return;
    }

    console.log('Seeding initial data into Aiven MySQL database...');

    const saltRounds = 10;
    const commonPasswordHash = await bcrypt.hash('Password@123', saltRounds);

    // 1. Create HR Admin User
    const hr = await User.create({
      employee_id: 'EMP-001',
      name: 'Jane Doe (HR)',
      email: 'hr@dayflow.com',
      password_hash: commonPasswordHash,
      role: 'HR',
      phone: '+1 (555) 234-5678',
      address: 'Dayflow Headquarters, HR Suite 100',
      profile_pic: null,
      is_verified: true
    });

    await JobDetails.create({
      user_id: hr.id,
      designation: 'HR Director',
      department: 'Human Resources',
      joining_date: '2023-01-15',
      employment_type: 'Full-time'
    });

    await Payroll.create({
      user_id: hr.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      basic_salary: 8500.00,
      allowances: 1200.00,
      deductions: 450.00,
      net_salary: 9250.00,
      payment_status: 'Paid',
      payment_date: new Date().toISOString().split('T')[0]
    });

    // 2. Create Employee User
    const emp1 = await User.create({
      employee_id: 'EMP-002',
      name: 'John Smith',
      email: 'employee@dayflow.com',
      password_hash: commonPasswordHash,
      role: 'Employee',
      phone: '+1 (555) 876-5432',
      address: '742 Evergreen Terrace, Springfield',
      profile_pic: null,
      is_verified: true
    });

    await JobDetails.create({
      user_id: emp1.id,
      designation: 'Senior Full Stack Engineer',
      department: 'Engineering',
      joining_date: '2023-06-01',
      employment_type: 'Full-time'
    });

    await Payroll.create({
      user_id: emp1.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      basic_salary: 6500.00,
      allowances: 800.00,
      deductions: 350.00,
      net_salary: 6950.00,
      payment_status: 'Paid',
      payment_date: new Date().toISOString().split('T')[0]
    });

    // 3. Create Additional Employee for realistic dashboard statistics
    const emp2 = await User.create({
      employee_id: 'EMP-003',
      name: 'Sarah Connor',
      email: 'sarah.connor@dayflow.com',
      password_hash: commonPasswordHash,
      role: 'Employee',
      phone: '+1 (555) 345-6789',
      address: '101 Cyberdyne Way, Los Angeles',
      profile_pic: null,
      is_verified: true
    });

    await JobDetails.create({
      user_id: emp2.id,
      designation: 'Product Designer',
      department: 'Design',
      joining_date: '2024-02-10',
      employment_type: 'Full-time'
    });

    await Payroll.create({
      user_id: emp2.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      basic_salary: 5800.00,
      allowances: 600.00,
      deductions: 250.00,
      net_salary: 6150.00,
      payment_status: 'Paid',
      payment_date: new Date().toISOString().split('T')[0]
    });

    // Seed Sample Attendance Records
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    await Attendance.create({
      user_id: emp1.id,
      date: yesterday,
      check_in: new Date(Date.now() - 86400000 - 32400000), // 9 hours ago yesterday
      check_out: new Date(Date.now() - 86400000),
      total_hours: 9.0,
      status: 'Present',
      notes: 'Completed sprint backlog items'
    });

    await Attendance.create({
      user_id: emp1.id,
      date: today,
      check_in: new Date(Date.now() - 14400000), // 4 hours ago
      check_out: null,
      total_hours: 4.0,
      status: 'Present',
      notes: 'Active workday session'
    });

    // Seed Sample Leave Requests
    await LeaveRequest.create({
      user_id: emp1.id,
      leave_type: 'Paid',
      start_date: '2026-09-01',
      end_date: '2026-09-03',
      days_count: 3,
      reason: 'Family vacation and personal travel',
      status: 'Approved',
      admin_comment: 'Approved by HR Director. Enjoy your time off!',
      approved_by: hr.id
    });

    await LeaveRequest.create({
      user_id: emp2.id,
      leave_type: 'Sick',
      start_date: '2026-08-25',
      end_date: '2026-08-26',
      days_count: 2,
      reason: 'Medical appointment and recovery',
      status: 'Pending',
      admin_comment: null,
      approved_by: null
    });

    // Seed Sample Notifications
    await Notification.create({
      user_id: emp1.id,
      title: 'Leave Request Approved',
      message: 'Your Paid leave request for Sep 01 - Sep 03 was approved by HR.',
      type: 'leave',
      is_read: false
    });

    await Notification.create({
      user_id: hr.id,
      title: 'New Leave Request Pending',
      message: 'Sarah Connor submitted a Sick leave request awaiting your approval.',
      type: 'leave',
      is_read: false
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

module.exports = seedDatabase;
