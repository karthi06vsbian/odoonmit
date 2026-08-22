import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { UserPlus, User, Mail, ShieldCheck, Key, ShieldAlert } from 'lucide-react';

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
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { employee_id, name, email, password, confirmPassword, role } = formData;

    if (!employee_id || !name || !email || !password || !confirmPassword) {
      return toast.error('All fields are required');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    // Password validation rules
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error('Password must be at least 8 chars, with 1 uppercase, 1 number, and 1 special character');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { employee_id, name, email, password, role });
      setVerificationEmail(email);
      setShowOtp(true);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP verification code');

    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email: verificationEmail, otp });
      toast.success('Registration and email verification successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        </div>

        {!showOtp ? (
          /* Sign Up Fields */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Employee ID
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    placeholder="EMP-025"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@dayflow.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Employee" className="bg-slate-900">Employee</option>
                  <option value="HR" className="bg-slate-900">HR / Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="text-xxs text-slate-500 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-400 block mb-1">Password requirements:</span>
              • Minimum 8 characters • At least one uppercase letter • At least one number • At least one special character
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors duration-200 disabled:opacity-50"
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
              <span className="text-xs text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        ) : (
          /* OTP Entry Step */
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 mb-4">
              <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 text-blue-400 shrink-0 mr-3 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  We've sent a 6-digit verification code to <span className="text-white font-bold">{verificationEmail}</span>. 
                  Enter it below to complete your registration.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-widest text-lg font-bold rounded-lg border border-slate-700 bg-slate-950/50 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Verify & Create Account'
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-300 mt-2 block"
            >
              Back to Sign Up Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
