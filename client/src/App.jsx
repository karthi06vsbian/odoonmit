import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import LeaveManagement from './pages/LeaveManagement';
import Payroll from './pages/Payroll';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Main Layout Wrapper
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="pl-64 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 mt-16 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaves" element={<LeaveManagement />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Portal Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<MainLayout />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  );
}

export default App;
