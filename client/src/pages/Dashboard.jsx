import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  Search, 
  Shield, 
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'HR';
  const navigate = useNavigate();

  // Employee Dashboard states
  const [empStats, setEmpStats] = useState({
    todayStatus: 'Absent',
    pendingLeaves: 0,
    totalSlips: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [empLoading, setEmpLoading] = useState(!isHR);

  // Admin Dashboard states
  const [adminStats, setAdminStats] = useState({
    totalEmployees: 0,
    checkedInToday: 0,
    pendingLeaves: 0
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [attendanceChartData, setAttendanceChartData] = useState([]);
  const [leaveChartData, setLeaveChartData] = useState([]);
  const [adminLoading, setAdminLoading] = useState(isHR);

  // Admin Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const fetchEmployeeDashboard = async () => {
    try {
      setEmpLoading(true);
      // Get attendance log for today
      const todayStr = new Date().toISOString().split('T')[0];
      const monthStart = new Date();
      monthStart.setDate(1);
      const startStr = monthStart.toISOString().split('T')[0];

      const resAttendance = await api.get(`/attendance/my-attendance?start_date=${startStr}&end_date=${todayStr}`);
      const todayRec = resAttendance.data.find(r => r.date === todayStr);

      const resLeaves = await api.get('/leave/my-leaves');
      const resPayroll = await api.get('/payroll/my-payroll');

      setEmpStats({
        todayStatus: todayRec ? todayRec.status : 'Absent',
        pendingLeaves: resLeaves.data.filter(l => l.status === 'Pending').length,
        totalSlips: resPayroll.data.length
      });

      // Populate recent activities (combining logs)
      const activities = [];
      resAttendance.data.slice(-3).reverse().forEach(a => {
        if (a.check_in) {
          activities.push({
            title: `Clocked in on ${a.date}`,
            time: new Date(a.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: 'bg-emerald-500/20 text-emerald-400'
          });
        }
      });
      resLeaves.data.slice(0, 2).forEach(l => {
        activities.push({
          title: `${l.leave_type} Leave request: ${l.status}`,
          time: new Date(l.applied_at).toLocaleDateString(),
          color: l.status === 'Approved' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'
        });
      });

      setRecentActivities(activities.slice(0, 4));
    } catch (error) {
      console.error(error);
    } finally {
      setEmpLoading(false);
    }
  };

  const fetchAdminDashboard = async () => {
    try {
      setAdminLoading(true);
      
      // Get all employees
      const resUsers = await api.get('/users');
      const staff = resUsers.data.filter(u => u.role === 'Employee');

      // Get today's attendance
      const todayStr = new Date().toISOString().split('T')[0];
      const resAtt = await api.get(`/attendance/all?date=${todayStr}`);

      // Get all leaves
      const resLeaves = await api.get('/leave/all');
      const pendingLeaves = resLeaves.data.filter(l => l.status === 'Pending');

      setAdminStats({
        totalEmployees: staff.length,
        checkedInToday: resAtt.data.filter(r => r.status === 'Present' || r.status === 'Half-day').length,
        pendingLeaves: pendingLeaves.length
      });

      setEmployeeList(resUsers.data);

      // Generate Charts
      // 1. Attendance status distribution
      const presentCount = resAtt.data.filter(r => r.status === 'Present').length;
      const halfDayCount = resAtt.data.filter(r => r.status === 'Half-day').length;
      const leaveCount = resAtt.data.filter(r => r.status === 'Leave').length;
      const absentCount = staff.length - (presentCount + halfDayCount + leaveCount);

      setAttendanceChartData([
        { name: 'Present', value: presentCount, color: '#10B981' },
        { name: 'Half-Day', value: halfDayCount, color: '#F59E0B' },
        { name: 'On Leave', value: leaveCount, color: '#6366F1' },
        { name: 'Absent', value: Math.max(0, absentCount), color: '#EF4444' }
      ]);

      // 2. Leaves by Department / Month count
      const leaveTypeCounts = { Paid: 0, Sick: 0, Unpaid: 0 };
      resLeaves.data.forEach(l => {
        if (leaveTypeCounts[l.leave_type] !== undefined) {
          leaveTypeCounts[l.leave_type]++;
        }
      });
      setLeaveChartData([
        { type: 'Paid Leave', Count: leaveTypeCounts.Paid },
        { type: 'Sick Leave', Count: leaveTypeCounts.Sick },
        { type: 'Unpaid Leave', Count: leaveTypeCounts.Unpaid }
      ]);

    } catch (error) {
      console.error(error);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (isHR) {
      fetchAdminDashboard();
    } else {
      fetchEmployeeDashboard();
    }
  }, [isHR]);

  const filteredEmployees = employeeList.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter ? emp.jobDetails?.department === deptFilter : true;
    return matchesSearch && matchesDept;
  });

  const getDepartments = () => {
    const depts = new Set(employeeList.map(emp => emp.jobDetails?.department).filter(Boolean));
    return Array.from(depts);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="px-2 py-0.5 rounded text-xxs font-semibold bg-emerald-500/10 text-emerald-400">Present</span>;
      case 'Half-day':
        return <span className="px-2 py-0.5 rounded text-xxs font-semibold bg-amber-500/10 text-amber-400">Half-day</span>;
      case 'Leave':
        return <span className="px-2 py-0.5 rounded text-xxs font-semibold bg-indigo-500/10 text-indigo-400">Leave</span>;
      case 'Absent':
        return <span className="px-2 py-0.5 rounded text-xxs font-semibold bg-rose-500/10 text-rose-400">Absent</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xxs font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Employee View Dashboard */}
      {!isHR && (
        <>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center space-x-4 shadow-lg">
              <div className="rounded-lg bg-blue-600/10 p-3 text-blue-400">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xxs text-slate-400 font-semibold uppercase tracking-wider">Today's Status</span>
                <span className="block text-lg font-bold text-white mt-1 capitalize">{empStats.todayStatus}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center space-x-4 shadow-lg">
              <div className="rounded-lg bg-amber-600/10 p-3 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xxs text-slate-400 font-semibold uppercase tracking-wider">Pending Leaves</span>
                <span className="block text-lg font-bold text-white mt-1">{empStats.pendingLeaves} requests</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center space-x-4 shadow-lg">
              <div className="rounded-lg bg-emerald-600/10 p-3 text-emerald-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xxs text-slate-400 font-semibold uppercase tracking-wider">Payslips Issued</span>
                <span className="block text-lg font-bold text-white mt-1">{empStats.totalSlips} slips</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Actions Panel */}
            <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center pb-3 border-b border-slate-800">
                <Sliders className="mr-2 h-4.5 w-4.5" />
                Quick Actions
              </h3>
              
              <div className="flex flex-col space-y-2">
                <Link to="/profile" className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 hover:bg-slate-950/70 border border-slate-850 hover:border-slate-800 transition-all text-xs font-semibold text-white">
                  <span>Update Profile Details</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>
                <Link to="/attendance" className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 hover:bg-slate-950/70 border border-slate-850 hover:border-slate-800 transition-all text-xs font-semibold text-white">
                  <span>Punch Work Attendance</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>
                <Link to="/leaves" className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 hover:bg-slate-950/70 border border-slate-850 hover:border-slate-800 transition-all text-xs font-semibold text-white">
                  <span>Apply for Time-Off</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center pb-3 border-b border-slate-800">
                <TrendingUp className="mr-2 h-4.5 w-4.5" />
                Recent Activities
              </h3>

              <div className="space-y-4 text-xs font-normal">
                {empLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                  </div>
                ) : recentActivities.length === 0 ? (
                  <p className="text-slate-500 py-4 text-center">No recent activities logged.</p>
                ) : (
                  recentActivities.map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 border border-slate-850">
                      <span className="text-slate-200">{act.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xxs font-semibold ${act.color}`}>{act.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* HR / Admin View Dashboard */}
      {isHR && (
        <>
          {/* Quick Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center space-x-4 shadow-lg">
              <div className="rounded-lg bg-blue-600/10 p-3 text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xxs text-slate-400 font-semibold uppercase tracking-wider">Total Staff</span>
                <span className="block text-lg font-bold text-white mt-1">{adminStats.totalEmployees} Employees</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center space-x-4 shadow-lg">
              <div className="rounded-lg bg-emerald-600/10 p-3 text-emerald-400">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xxs text-slate-400 font-semibold uppercase tracking-wider">Active Today</span>
                <span className="block text-lg font-bold text-white mt-1">{adminStats.checkedInToday} Check-ins</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center space-x-4 shadow-lg">
              <div className="rounded-lg bg-amber-600/10 p-3 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xxs text-slate-400 font-semibold uppercase tracking-wider">Time-Off Requests</span>
                <span className="block text-lg font-bold text-white mt-1">{adminStats.pendingLeaves} Pending</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pie Chart: Attendance Status today */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
                Today's Attendance Status Distribution
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceChartData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceChartData.filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', color: 'white', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legends */}
                <div className="ml-4 space-y-1.5 text-xs text-slate-400">
                  {attendanceChartData.map((entry, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                      <span>{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart: Leave Applications trend */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
                Cumulative Time-Off Request Categories
              </h3>
              <div className="h-64 text-slate-300">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="type" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', color: 'white', borderRadius: '8px' }} />
                    <Bar dataKey="Count" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                      <Cell fill="#3B82F6" />
                      <Cell fill="#10B981" />
                      <Cell fill="#F59E0B" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Searchable Staff Roster */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 mb-6 gap-4">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center">
                <Shield className="mr-2 h-4.5 w-4.5" />
                Staff Roster Directory
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name/ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded border border-slate-800 bg-slate-950/40 py-1.5 pl-8 pr-3 text-white focus:outline-none"
                  />
                </div>

                {/* Filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="rounded border border-slate-800 bg-slate-950/40 py-1.5 px-3 text-white focus:outline-none"
                >
                  <option value="">All Departments</option>
                  {getDepartments().map((dept, idx) => (
                    <option key={idx} value={dept} className="bg-slate-900">{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              {adminLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                </div>
              ) : (
                <>
                  {filteredEmployees.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No staff members match the filters.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                      {filteredEmployees.map((emp) => {
                        const avatarUrl = emp.profile_pic 
                          ? `http://localhost:5001/${emp.profile_pic}` 
                          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                        return (
                          <div
                            key={emp.id}
                            onClick={() => navigate(`/profile/${emp.id}`)}
                            className="cursor-pointer group flex flex-col items-center text-center p-5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-slate-700 transition-all shadow-md hover:shadow-xl"
                          >
                            <img
                              src={avatarUrl}
                              alt={emp.name}
                              className="h-16 w-16 rounded-full object-cover border-2 border-slate-800 group-hover:border-blue-500 transition-colors"
                            />
                            <h4 className="mt-3 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{emp.name}</h4>
                            <p className="text-xxs text-slate-500 font-semibold uppercase mt-0.5">{emp.employee_id}</p>
                            
                            <div className="mt-4 pt-3 border-t border-slate-900/80 w-full text-xxs space-y-1.5 text-slate-400 font-normal">
                              <p><strong className="text-slate-500 font-semibold">Title:</strong> {emp.jobDetails?.designation || 'N/A'}</p>
                              <p><strong className="text-slate-500 font-semibold">Dept:</strong> {emp.jobDetails?.department || 'N/A'}</p>
                            </div>
                            
                            <span className="mt-4 text-xxs font-bold text-blue-400 group-hover:underline">
                              Manage Profile &rarr;
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;
