import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('hr@dayflow.com');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter your Email/Employee ID and password');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res.data;
      login(user, accessToken, refreshToken);
      toast.success('Welcome back to Dayflow!');
      navigate('/');
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      if (data?.needs_verification) {
        setVerificationEmail(data.email || email);
        setShowOtpVerification(true);
        toast.info(data.message);
      } else {
        toast.error(data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: demoEmail, password: demoPassword });
      const { accessToken, refreshToken, user } = res.data;
      login(user, accessToken, refreshToken);
      toast.success(`Logged in as ${user.name}!`);
      navigate('/');
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      toast.error(data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP verification code');

    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email: verificationEmail, otp });
      toast.success('Email verified successfully! You can now log in.');
      setShowOtpVerification(false);
      setOtp('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"></div>

      <div className="z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30 text-white font-black text-xl mb-4">
            D
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to Dayflow</h2>
          <p className="mt-1.5 text-xs text-slate-400">Every workday, perfectly aligned.</p>
        </div>

        {!showOtpVerification ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email or Employee ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dayflow.com or EMP-001"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
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
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800/80"></div>
              <span className="flex-shrink mx-3 text-slate-500 text-xxs font-bold uppercase tracking-wider">Demo Quick Login</span>
              <div className="flex-grow border-t border-slate-800/80"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('hr@dayflow.com', 'Password@123')}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-slate-700 transition-all text-left"
              >
                <span className="text-xxs font-bold text-blue-400">HR Admin</span>
                <span className="text-xxs text-slate-400 font-normal mt-0.5">Jane Doe</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('employee@dayflow.com', 'Password@123')}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-slate-700 transition-all text-left"
              >
                <span className="text-xxs font-bold text-emerald-400">Employee</span>
                <span className="text-xxs text-slate-400 font-normal mt-0.5">John Doe</span>
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  Create one
                </Link>
              </span>
            </div>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleOtpVerifySubmit} className="space-y-5">
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 mb-4">
              <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 text-blue-400 shrink-0 mr-3 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  We've sent a 6-digit OTP verification code to <span className="text-white font-bold">{verificationEmail}</span>. 
                  Please check your inbox (or backend server logs) to verify.
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
                'Verify & Activate'
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowOtpVerification(false)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-300 mt-2 block"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
