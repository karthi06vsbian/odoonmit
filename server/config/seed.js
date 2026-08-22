const bcrypt = require('bcrypt');
const { User, JobDetails, Attendance, LeaveRequest, Payroll, Notification } = require('../models');

const seedDatabase = async () => {
  try {
    // Check if users already exist
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seeder...');
      return;
    }

    console.log('Seeding initial data...');

    const saltRounds = 10;
    const commonPasswordHash = await bcrypt.hash('Password@123', saltRounds);

    // 1. Create HR User
    const hr = await User.create({
      employee_id: 'EMP-001',
      name: 'Jane Doe (HR)',
      email: 'hr@dayflow.com',
      password_hash: commonPasswordHash,
      role: 'HR',
      phone: '123-456-7890',
      address: 'Dayflow Headquarters, HR Suite 100',
      is_verified: true
    });

    await JobDetails.create({
      user_id: hr.id,
      designation: 'HR Director',
      department: 'Human Resources',
      joining_date: '2025-01-15',
      employment_type: 'Full-time'
    });

    // 2. Create Employee User
    const emp = await User.create({
      employee_id: 'EMP-002',
      name: 'John Smith',
      email: 'employee@dayflow.com',
      password_hash: commonPasswordHash,
      role: 'Employee',
      phone: '987-654-3210',
      address: '123 Maple Street, Springfield',
      is_verified: true
    });

    await JobDetails.create({
      user_id: emp.id,
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      joining_date: '2025-03-01',
      employment_type: 'Full-time'
    });

    // 3. Seed Attendance Records for Employee (EMP-002) for the last few days
    const today = new Date();
    const attendanceRecords = [];
    const statuses = ['Present', 'Present', 'Present', 'Half-day', 'Present'];

    for (let i = 5; i > 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Don't seed on weekends (Saturday=6, Sunday=0)
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const status = statuses[i % statuses.length];
      
      let check_in = null;
      let check_out = null;

      if (status === 'Present') {
        check_in = new Date(dateStr + 'T09:00:00');
        check_out = new Date(dateStr + 'T18:00:00');
      } else if (status === 'Half-day') {
        check_in = new Date(dateStr + 'T09:00:00');
        check_out = new Date(dateStr + 'T13:00:00');
      }

      attendanceRecords.push({
        user_id: emp.id,
        date: dateStr,
        check_in,
        check_out,
        status
      });
    }

    await Attendance.bulkCreate(attendanceRecords);

    // 4. Seed Leave Request
    await LeaveRequest.create({
      user_id: emp.id,
      leave_type: 'Sick',
      start_date: new Date(today.getTime() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
      end_date: new Date(today.getTime() + 86400000 * 3).toISOString().split('T')[0],   // 3 days from now
      remarks: 'Need medical leave for dental checkup.',
      status: 'Pending',
      applied_at: new Date()
    });

    // 5. Seed Payroll
    await Payroll.create({
      user_id: emp.id,
      basic_salary: 8000.00,
      allowances: 1500.00,
      deductions: 500.00,
      net_salary: 9000.00,
      month: 7, // July
      year: 2026
    });

    // 6. Seed Notification
    await Notification.create({
      user_id: emp.id,
      message: 'Welcome to Dayflow HRMS! Please complete your profile details.',
      type: 'System',
      is_read: false,
      created_at: new Date()
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
