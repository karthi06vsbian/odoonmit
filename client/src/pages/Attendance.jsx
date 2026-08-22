import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Clock, Play, Square, Calendar, Search, User } from 'lucide-react';

export const Attendance = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'HR';

  // State for Employee Check-in/out
  const [todayRecord, setTodayRecord] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // State for Attendance Log (Employee)
  const [myLog, setMyLog] = useState([]);
  const [logLoading, setLogLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // State for HR view of all employee attendance
  const [hrDate, setHrDate] = useState(new Date().toISOString().split('T')[0]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [hrLoading, setHrLoading] = useState(false);
  const [hrSearchQuery, setHrSearchQuery] = useState('');

  // Set default date range to current month
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setDateRange({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    });
  }, []);

  // Fetch my log when dates change
  const fetchMyLog = async () => {
    if (!dateRange.startDate || !dateRange.endDate) return;
    setLogLoading(true);
    try {
      const res = await api.get(`/attendance/my-attendance?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`);
      setMyLog(res.data);

      // Check if today is clocked in/out
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRec = res.data.find(r => r.date === todayStr);
      if (todayRec && todayRec.check_in) {
        setTodayRecord(todayRec);
        setClockInTime(new Date(todayRec.check_in).toLocaleTimeString());
        if (todayRec.check_out) {
          setClockOutTime(new Date(todayRec.check_out).toLocaleTimeString());
        }
      } else {
        setTodayRecord(null);
        setClockInTime(null);
        setClockOutTime(null);
      }
    } catch (error) {
      toast.error('Failed to retrieve attendance logs');
    } finally {
      setLogLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLog();
  }, [dateRange]);

  // Fetch all attendance for HR
  const fetchAllAttendance = async () => {
    if (!isHR || !hrDate) return;
    setHrLoading(true);
    try {
      const res = await api.get(`/attendance/all?date=${hrDate}`);
      setAllAttendance(res.data);
    } catch (error) {
      toast.error('Failed to retrieve company attendance');
    } finally {
      setHrLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, [hrDate]);

  const handleCheckIn = async () => {
    setLoadingAction(true);
    try {
      const res = await api.post('/attendance/check-in');
      toast.success(res.data.message);
      fetchMyLog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCheckOut = async () => {
    setLoadingAction(true);
    try {
      const res = await api.post('/attendance/check-out');
      toast.success(res.data.message);
      fetchMyLog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoadingAction(false);
    }
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return '-';
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-emerald-500/10 text-emerald-400">Present</span>;
      case 'Half-day':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-amber-500/10 text-amber-400">Half-day</span>;
      case 'Leave':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-indigo-500/10 text-indigo-400">Leave</span>;
      case 'Absent':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-rose-500/10 text-rose-400">Absent</span>;
      case 'Weekend':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-slate-800 text-slate-500">Weekend</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const filteredHRLog = allAttendance.filter(r => 
    r.name.toLowerCase().includes(hrSearchQuery.toLowerCase()) ||
    r.employee_id.toLowerCase().includes(hrSearchQuery.toLowerCase()) ||
    r.department.toLowerCase().includes(hrSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Attendance Tracker</h2>
        <p className="text-xs text-slate-400 font-medium">Clock in, clock out, and track work logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Punch Clock Panel */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between shadow-lg h-fit">
          <div>
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Work Clock
            </h3>
            
            <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-slate-800/60 mb-6">
              <span className="block text-2xl font-black text-white tracking-widest">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="block text-xxs text-slate-500 font-medium mt-1">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-3.5 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Status today:</span>
                {getStatusBadge(todayRecord ? todayRecord.status : 'Not Clocked')}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Clock In:</span>
                <span className="font-semibold text-white">{clockInTime || '--:--'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Clock Out:</span>
                <span className="font-semibold text-white">{clockOutTime || '--:--'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCheckIn}
              disabled={!!clockInTime || loadingAction}
              className="flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 text-xs shadow-lg shadow-emerald-600/10 transition-colors"
            >
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Clock In
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!clockInTime || !!clockOutTime || loadingAction}
              className="flex items-center justify-center rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold py-2.5 text-xs shadow-lg shadow-rose-600/10 transition-colors"
            >
              <Square className="mr-1.5 h-3.5 w-3.5" />
              Clock Out
            </button>
          </div>
        </div>

        {/* Right Side: Log / Search Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Employee Attendance log */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 mb-6 gap-4">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                My Attendance Log
              </h3>
              
              {/* Date Filters */}
              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="rounded border border-slate-750 bg-slate-950/40 px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="rounded border border-slate-750 bg-slate-950/40 px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {logLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-650 border-t-blue-500"></div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Clock In</th>
                      <th className="py-2.5">Clock Out</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {myLog.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">No log entries found.</td>
                      </tr>
                    ) : (
                      myLog.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-850/20">
                          <td className="py-2.5 font-medium">{log.date}</td>
                          <td className="py-2.5">{formatDateTime(log.check_in)}</td>
                          <td className="py-2.5">{formatDateTime(log.check_out)}</td>
                          <td className="py-2.5 text-right">{getStatusBadge(log.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* HR Administration Portal */}
          {isHR && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 mb-6 gap-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Staff Attendance Administration
                </h3>
                
                <div className="flex items-center space-x-3 text-xs">
                  <input
                    type="date"
                    value={hrDate}
                    onChange={(e) => setHrDate(e.target.value)}
                    className="rounded border border-slate-750 bg-slate-950/40 px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Search filter bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by Employee Name, ID, or Department..."
                  value={hrSearchQuery}
                  onChange={(e) => setHrSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-850 bg-slate-950/40 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="overflow-x-auto">
                {hrLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-650 border-t-blue-500"></div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-2.5">Emp ID</th>
                        <th className="py-2.5">Name</th>
                        <th className="py-2.5">Department</th>
                        <th className="py-2.5">Clock In</th>
                        <th className="py-2.5">Clock Out</th>
                        <th className="py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {filteredHRLog.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">No records matching the filters.</td>
                        </tr>
                      ) : (
                        filteredHRLog.map((rec, idx) => (
                          <tr key={idx} className="hover:bg-slate-850/20">
                            <td className="py-2.5 font-medium text-slate-400">{rec.employee_id}</td>
                            <td className="py-2.5 font-semibold text-slate-100">{rec.name}</td>
                            <td className="py-2.5 text-slate-400">{rec.department}</td>
                            <td className="py-2.5">{formatDateTime(rec.check_in)}</td>
                            <td className="py-2.5">{formatDateTime(rec.check_out)}</td>
                            <td className="py-2.5 text-right">{getStatusBadge(rec.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
