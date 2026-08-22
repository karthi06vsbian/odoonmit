import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import { UserPlus, Key, Mail, User, Shield, ShieldAlert } from 'lucide-react';
=======
import { UserPlus, Key, Mail, User, Shield, IdCard, ShieldAlert } from 'lucide-react';
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf

export const Register = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee'
  });
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return toast.error('Password must be at least 8 chars with 1 uppercase, 1 number, and 1 special symbol.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        employee_id: formData.employee_id,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      toast.success(res.data.message || 'Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      toast.error(data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-10 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-pink-100/40 blur-3xl pointer-events-none"></div>

      <div className="z-10 w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#714B67] shadow-lg shadow-purple-900/15 text-white font-black text-2xl mb-4 tracking-tight">
            o
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Create an <span className="text-[#714B67]">odooXnmit</span> Account
          </h2>
          <p className="mt-1.5 text-xs text-gray-500 font-medium">Join the enterprise workforce network</p>
=======
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"></div>

      <div className="z-10 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30 text-white font-black text-xl mb-4">
            D
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create your Dayflow Account</h2>
          <p className="mt-1.5 text-xs text-slate-400">Join the workforce management system today.</p>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Employee ID
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
=======
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Employee ID
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  placeholder="EMP-025"
<<<<<<< HEAD
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
=======
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  required
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
=======
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
<<<<<<< HEAD
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
=======
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
=======
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
<<<<<<< HEAD
                  placeholder="john@odoo.com"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
=======
                  placeholder="john@dayflow.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
=======
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
<<<<<<< HEAD
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
              >
                <option value="Employee">Employee</option>
                <option value="HR">HR / Admin</option>
=======
                className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="Employee" className="bg-slate-900">Employee</option>
                <option value="HR" className="bg-slate-900">HR / Admin</option>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
=======
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
<<<<<<< HEAD
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
=======
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
=======
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
<<<<<<< HEAD
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
=======
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  required
                />
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <p className="text-[11px] text-gray-500">
            Password requirements: <span className="text-gray-700 font-medium">• Minimum 8 characters • At least 1 uppercase • 1 number • 1 special symbol</span>
=======
          <p className="text-[11px] text-slate-400">
            Password requirements: <span className="text-slate-300">• Minimum 8 characters • At least one uppercase letter • At least one number • At least one special character</span>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
          </p>

          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
            className="flex w-full items-center justify-center rounded-xl bg-[#714B67] hover:bg-[#5d3d54] mt-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-900/15 transition-all duration-200 disabled:opacity-50"
=======
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 mt-6 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors duration-200 disabled:opacity-50"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </>
            )}
          </button>

          <div className="text-center mt-4">
<<<<<<< HEAD
            <span className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#714B67] hover:underline transition-colors">
=======
            <span className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                Sign In
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
