const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db');
const seedDatabase = require('./config/seed');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const payrollRoutes = require('./routes/payroll');
const notificationRoutes = require('./routes/notification');

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/notifications', notificationRoutes);

// Simple root check
app.get('/', (req, res) => {
  res.json({ message: 'Dayflow HRMS Server is running.' });
});

// Database Synchronization and Server Startup
const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Sync Database Schema (create tables if they don't exist)
  try {
    await sequelize.sync({ force: false }); // Set to true only if you want to reset DB
    console.log('Database tables synchronized successfully.');
    
    // Seed database with initial users
    await seedDatabase();
  } catch (error) {
    console.error('Database synchronization error:', error);
  }

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
};

startServer();
