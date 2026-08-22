import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { UserPlus, Key, Mail, User, Shield, ShieldAlert } from 'lucide-react';

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
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Employee ID
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  placeholder="EMP-025"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@odoo.com"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
              >
                <option value="Employee">Employee</option>
                <option value="HR">HR / Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500">
            Password requirements: <span className="text-gray-700 font-medium">• Minimum 8 characters • At least 1 uppercase • 1 number • 1 special symbol</span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#714B67] hover:bg-[#5d3d54] mt-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-900/15 transition-all duration-200 disabled:opacity-50"
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
            <span className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#714B67] hover:underline transition-colors">
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
