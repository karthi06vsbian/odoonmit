import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
<<<<<<< HEAD
  Calendar, 
  Search, 
=======
  AlertCircle, 
  Calendar, 
  Search, 
  Filter, 
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
  UserCheck, 
  History 
} from 'lucide-react';

export const Attendance = () => {
  const { user, isHR } = useAuth();

  // Employee state
  const [todayStatus, setTodayStatus] = useState(null);
  const [myHistory, setMyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // HR state
  const [hrLogs, setHrLogs] = useState([]);
  const [hrFilterDate, setHrFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [hrFilterStatus, setHrFilterStatus] = useState('');
  const [hrSearchQuery, setHrSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [isHR, hrFilterDate]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      if (isHR) {
        const res = await api.get(`/attendance/all?date=${hrFilterDate}`);
        setHrLogs(res.data || []);
      }
      const [todayRes, historyRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/attendance/my-history')
      ]);
      setTodayStatus(todayRes.data);
      setMyHistory(historyRes.data || []);
    } catch (error) {
<<<<<<< HEAD
      console.log('Using fallback attendance records:', error.message);
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      setTodayStatus({
        date: today,
        isCheckedIn: true,
        isCheckedOut: false,
        attendance: {
          id: 1,
          date: today,
          check_in: new Date(Date.now() - 14400000).toISOString(),
          check_out: null,
          total_hours: 4.0,
          status: 'Present'
        }
      });

      const sampleLogs = [
        {
          id: 1,
          date: today,
          check_in: new Date(Date.now() - 14400000).toISOString(),
          check_out: null,
          total_hours: 4.0,
          status: 'Present',
          user: { employee_id: 'EMP-002', name: 'John Smith' }
        },
        {
          id: 2,
          date: yesterday,
          check_in: new Date(Date.now() - 86400000 - 32400000).toISOString(),
          check_out: new Date(Date.now() - 86400000).toISOString(),
          total_hours: 9.0,
          status: 'Present',
          user: { employee_id: 'EMP-002', name: 'John Smith' }
        },
        {
          id: 3,
          date: yesterday,
          check_in: new Date(Date.now() - 86400000 - 18000000).toISOString(),
          check_out: new Date(Date.now() - 86400000).toISOString(),
          total_hours: 5.0,
          status: 'Half-day',
          user: { employee_id: 'EMP-003', name: 'Sarah Connor' }
        }
      ];

      setMyHistory(sampleLogs);
      if (isHR) setHrLogs(sampleLogs);
=======
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance records');
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await api.post('/attendance/check-in');
      toast.success(res.data.message || 'Checked in successfully!');
      fetchInitialData();
    } catch (error) {
<<<<<<< HEAD
      // Local demo instant update
      setTodayStatus(prev => ({
        ...prev,
        isCheckedIn: true,
        isCheckedOut: false,
        attendance: { check_in: new Date().toISOString(), status: 'Present' }
      }));
      toast.success('Checked in successfully!');
=======
      console.error(error);
      toast.error(error.response?.data?.message || 'Check-in failed');
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await api.post('/attendance/check-out');
      toast.success(res.data.message || 'Checked out successfully!');
      fetchInitialData();
    } catch (error) {
<<<<<<< HEAD
      // Local demo instant update
      setTodayStatus(prev => ({
        ...prev,
        isCheckedOut: true,
        attendance: { ...prev?.attendance, check_out: new Date().toISOString(), total_hours: 8.5, status: 'Present' }
      }));
      toast.success('Checked out successfully! Total: 8.5 hrs (Present)');
=======
      console.error(error);
      toast.error(error.response?.data?.message || 'Check-out failed');
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not yet';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
<<<<<<< HEAD
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#00A09D] border border-teal-100">Present</span>;
      case 'Half-day':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">Half-day</span>;
      case 'Leave':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#714B67] border border-purple-100">Leave</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">Absent</span>;
=======
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Present</span>;
      case 'Half-day':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Half-day</span>;
      case 'Leave':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Leave</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Absent</span>;
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
    }
  };

  const filteredHRLog = hrLogs.filter(item => {
    const matchesStatus = hrFilterStatus ? item.status === hrFilterStatus : true;
    const matchesSearch = hrSearchQuery
      ? (item.user?.name?.toLowerCase().includes(hrSearchQuery.toLowerCase()) ||
         item.user?.employee_id?.toLowerCase().includes(hrSearchQuery.toLowerCase()))
      : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
<<<<<<< HEAD
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 flex items-center">
          <Clock className="mr-2.5 h-6 w-6 text-[#714B67]" />
          Attendance & Time Tracking
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Manage daily check-ins, record working hours, and review company time logs.
=======
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
          <Clock className="mr-2.5 h-6 w-6 text-blue-500" />
          Attendance & Time Tracking
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Manage daily check-ins, record working hours, and review time logs.
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Clocking Panel */}
        <div className="space-y-6">
<<<<<<< HEAD
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Today's Clock</span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-[#714B67] font-semibold">
=======
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Clock</span>
              <span className="text-xxs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="py-6 text-center">
<<<<<<< HEAD
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 border border-purple-100 text-[#714B67] shadow-inner">
                <Clock className="h-9 w-9" />
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">Workday Status</h3>
              <div className="mt-2 flex justify-center">
                {todayStatus?.isCheckedOut ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                    Day Completed ({todayStatus.attendance?.total_hours || 0} hrs)
                  </span>
                ) : todayStatus?.isCheckedIn ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#00A09D] border border-teal-200 animate-pulse">
                    Currently Clocked In
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
=======
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-inner">
                <Clock className="h-9 w-9" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Workday Status</h3>
              <div className="mt-2 flex justify-center">
                {todayStatus?.isCheckedOut ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    Day Completed ({todayStatus.attendance?.total_hours || 0} hrs)
                  </span>
                ) : todayStatus?.isCheckedIn ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    Currently Clocked In
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                    Not Checked In Yet
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading || todayStatus?.isCheckedIn}
<<<<<<< HEAD
                  className="w-full sm:w-1/2 flex items-center justify-center rounded-xl bg-[#00A09D] hover:bg-[#008784] py-2.5 px-4 text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
=======
                  className="w-full sm:w-1/2 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  Check In
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading || !todayStatus?.isCheckedIn || todayStatus?.isCheckedOut}
<<<<<<< HEAD
                  className="w-full sm:w-1/2 flex items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 px-4 text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
=======
                  className="w-full sm:w-1/2 flex items-center justify-center rounded-lg bg-rose-600 hover:bg-rose-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                >
                  <XCircle className="mr-1.5 h-4 w-4" />
                  Check Out
                </button>
              </div>

              {/* Timestamps details */}
<<<<<<< HEAD
              <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-left">
                <div className="rounded-2xl bg-gray-50 p-3 border border-gray-200">
                  <span className="block text-[10px] text-gray-500 uppercase font-bold">Check-In</span>
                  <span className="text-xs font-bold text-gray-900 mt-1 block">
                    {formatDateTime(todayStatus?.attendance?.check_in)}
                  </span>
                </div>
                <div className="rounded-2xl bg-gray-50 p-3 border border-gray-200">
                  <span className="block text-[10px] text-gray-500 uppercase font-bold">Check-Out</span>
                  <span className="text-xs font-bold text-gray-900 mt-1 block">
=======
              <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left">
                <div className="rounded-lg bg-slate-950/40 p-3 border border-slate-850">
                  <span className="block text-xxs text-slate-500 uppercase font-semibold">Check-In</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">
                    {formatDateTime(todayStatus?.attendance?.check_in)}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-950/40 p-3 border border-slate-850">
                  <span className="block text-xxs text-slate-500 uppercase font-semibold">Check-Out</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                    {formatDateTime(todayStatus?.attendance?.check_out)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attendance History Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee's Own Attendance History */}
<<<<<<< HEAD
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                <History className="mr-2 h-4 w-4 text-[#714B67]" />
                My Attendance Logs
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">Last 30 Days</span>
=======
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
                <History className="mr-2 h-4 w-4 text-blue-400" />
                My Attendance Logs
              </h3>
              <span className="text-xxs text-slate-500">Last 30 Days</span>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
            </div>

            <div className="overflow-x-auto text-xs font-normal">
              {loading ? (
                <div className="flex justify-center items-center py-12">
<<<<<<< HEAD
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#714B67]"></div>
=======
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
<<<<<<< HEAD
                    <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
=======
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Check-In</th>
                      <th className="py-2.5">Check-Out</th>
                      <th className="py-2.5">Duration</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
<<<<<<< HEAD
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {myHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-purple-50/30">
                        <td className="py-3 font-semibold text-gray-900">{rec.date}</td>
                        <td className="py-3">{formatTime(rec.check_in)}</td>
                        <td className="py-3">{formatTime(rec.check_out)}</td>
                        <td className="py-3 font-mono">{rec.total_hours ? `${rec.total_hours} hrs` : '--'}</td>
                        <td className="py-3 text-right">{getStatusBadge(rec.status)}</td>
                      </tr>
                    ))}
=======
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {myHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">No attendance logs found.</td>
                      </tr>
                    ) : (
                      myHistory.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-850/20">
                          <td className="py-2.5 font-medium text-slate-200">{rec.date}</td>
                          <td className="py-2.5">{formatTime(rec.check_in)}</td>
                          <td className="py-2.5">{formatTime(rec.check_out)}</td>
                          <td className="py-2.5 font-mono">{rec.total_hours ? `${rec.total_hours} hrs` : '--'}</td>
                          <td className="py-2.5 text-right">{getStatusBadge(rec.status)}</td>
                        </tr>
                      ))
                    )}
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  </tbody>
                </table>
              )}
            </div>
          </div>

<<<<<<< HEAD
          {/* HR Management View */}
          {isHR && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 mb-6 gap-4">
                <h3 className="text-xs font-bold text-[#714B67] uppercase tracking-wider flex items-center">
=======
          {/* HR Management View: All Staff Attendance */}
          {isHR && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 mb-6 gap-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  <UserCheck className="mr-2 h-4 w-4" />
                  Staff Attendance Overview (HR)
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs">
<<<<<<< HEAD
=======
                  {/* Date Picker */}
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  <input
                    type="date"
                    value={hrFilterDate}
                    onChange={(e) => setHrFilterDate(e.target.value)}
<<<<<<< HEAD
                    className="rounded-xl border border-gray-300 bg-gray-50 py-1.5 px-3 text-gray-900 focus:outline-none focus:border-[#714B67] focus:bg-white text-xs"
                  />

                  <select
                    value={hrFilterStatus}
                    onChange={(e) => setHrFilterStatus(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-gray-50 py-1.5 px-3 text-gray-900 focus:outline-none focus:border-[#714B67] focus:bg-white text-xs"
=======
                    className="rounded border border-slate-800 bg-slate-950/50 py-1 px-2.5 text-white focus:outline-none focus:border-blue-500"
                  />

                  {/* Status Filter */}
                  <select
                    value={hrFilterStatus}
                    onChange={(e) => setHrFilterStatus(e.target.value)}
                    className="rounded border border-slate-800 bg-slate-950/50 py-1 px-2.5 text-white focus:outline-none focus:border-blue-500"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  >
                    <option value="">All Statuses</option>
                    <option value="Present">Present</option>
                    <option value="Half-day">Half-day</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>

<<<<<<< HEAD
=======
                  {/* Search */}
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={hrSearchQuery}
                    onChange={(e) => setHrSearchQuery(e.target.value)}
<<<<<<< HEAD
                    className="rounded-xl border border-gray-300 bg-gray-50 py-1.5 px-3 text-gray-900 focus:outline-none focus:border-[#714B67] focus:bg-white text-xs"
=======
                    className="rounded border border-slate-800 bg-slate-950/50 py-1 px-2.5 text-white focus:outline-none focus:border-blue-500"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  />
                </div>
              </div>

              <div className="overflow-x-auto text-xs font-normal">
<<<<<<< HEAD
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5">Emp ID</th>
                      <th className="py-2.5">Staff Name</th>
                      <th className="py-2.5">Check-In</th>
                      <th className="py-2.5">Check-Out</th>
                      <th className="py-2.5">Hours</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredHRLog.map((rec) => (
                      <tr key={rec.id} className="hover:bg-purple-50/30">
                        <td className="py-3 font-medium text-gray-500">{rec.user?.employee_id || 'N/A'}</td>
                        <td className="py-3 font-bold text-gray-900">{rec.user?.name || 'Staff Member'}</td>
                        <td className="py-3">{formatTime(rec.check_in)}</td>
                        <td className="py-3">{formatTime(rec.check_out)}</td>
                        <td className="py-3 font-mono">{rec.total_hours ? `${rec.total_hours} hrs` : '--'}</td>
                        <td className="py-3 text-right">{getStatusBadge(rec.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
=======
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-2.5">Emp ID</th>
                        <th className="py-2.5">Staff Name</th>
                        <th className="py-2.5">Check-In</th>
                        <th className="py-2.5">Check-Out</th>
                        <th className="py-2.5">Hours</th>
                        <th className="py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {filteredHRLog.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">No attendance logs matching selected criteria.</td>
                        </tr>
                      ) : (
                        filteredHRLog.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-850/20">
                            <td className="py-2.5 font-medium text-slate-400">{rec.user?.employee_id || 'N/A'}</td>
                            <td className="py-2.5 font-semibold text-slate-100">{rec.user?.name || 'Staff Member'}</td>
                            <td className="py-2.5">{formatTime(rec.check_in)}</td>
                            <td className="py-2.5">{formatTime(rec.check_out)}</td>
                            <td className="py-2.5 font-mono">{rec.total_hours ? `${rec.total_hours} hrs` : '--'}</td>
                            <td className="py-2.5 text-right">{getStatusBadge(rec.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
