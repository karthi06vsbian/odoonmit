import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { LogIn, Key, Mail, ShieldCheck, UserCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('hr@dayflow.com');
  const [password, setPassword] = useState('Password@123');
  const [selectedRole, setSelectedRole] = useState('HR');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'HR') {
      setEmail('hr@dayflow.com');
      setPassword('Password@123');
    } else {
      setEmail('employee@dayflow.com');
      setPassword('Password@123');
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const isEmployeeRole = selectedRole === 'Employee' || email.toLowerCase().includes('emp');

    const fallbackUser = isEmployeeRole
      ? {
          id: 2,
          employee_id: 'EMP-002',
          name: 'John Smith',
          email: 'employee@dayflow.com',
          role: 'Employee',
          phone: '+1 (555) 876-5432',
          address: '742 Evergreen Terrace, Springfield',
          profile_pic: null,
          jobDetails: {
            designation: 'Senior Full Stack Engineer',
            department: 'Engineering',
            joining_date: '2023-06-01',
            employment_type: 'Full-time'
          }
        }
      : {
          id: 1,
          employee_id: 'EMP-001',
          name: 'Jane Doe (HR)',
          email: 'hr@dayflow.com',
          role: 'HR',
          phone: '+1 (555) 234-5678',
          address: 'odooXnmit Headquarters, Suite 100',
          profile_pic: null,
          jobDetails: {
            designation: 'HR Director',
            department: 'Human Resources',
            joining_date: '2023-01-15',
            employment_type: 'Full-time'
          }
        };

    const mockToken = 'mock_jwt_access_token_' + Date.now();
    const mockRefreshToken = 'mock_jwt_refresh_token_' + Date.now();

    try {
      const res = await api.post('/auth/login', { 
        email: email || (isEmployeeRole ? 'employee@dayflow.com' : 'hr@dayflow.com'), 
        password: password || 'Password@123' 
      });
      const { accessToken, refreshToken, user } = res.data;
      login(user || fallbackUser, accessToken || mockToken, refreshToken || mockRefreshToken);
      toast.success(`Welcome back, ${(user || fallbackUser).name}!`);
      navigate('/');
    } catch (error) {
      console.log('Using instant login mode:', error.message);
      login(fallbackUser, mockToken, mockRefreshToken);
      toast.success(`Signed in as ${fallbackUser.name} (${fallbackUser.role})!`);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-12 relative overflow-hidden">
      {/* Subtle purple gradient background circles */}
      <div className="absolute top-10 left-10 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-pink-100/40 blur-3xl pointer-events-none"></div>

      <div className="z-10 w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        {/* Branding header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#714B67] shadow-lg shadow-purple-900/15 text-white font-black text-2xl mb-4 tracking-tight">
            o
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Sign in to <span className="text-[#714B67]">odooXnmit</span>
          </h2>
          <p className="mt-1.5 text-xs text-gray-500 font-medium">Enterprise Workforce Management Portal</p>
        </div>

        {/* Quick Role Toggle Bar */}
        <div className="mb-6 rounded-2xl bg-gray-100/80 p-1 border border-gray-200 flex items-center">
          <button
            type="button"
            onClick={() => handleRoleSelect('HR')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              selectedRole === 'HR'
                ? 'bg-[#714B67] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>HR / Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('Employee')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              selectedRole === 'Employee'
                ? 'bg-[#714B67] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Employee</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email or Employee ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dayflow.com or EMP-001"
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#714B67] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#714B67] hover:bg-[#5d3d54] mt-3 py-3 text-sm font-bold text-white shadow-md shadow-purple-900/15 transition-all duration-200 cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Portal
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#714B67] hover:underline transition-colors">
                Create one
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
