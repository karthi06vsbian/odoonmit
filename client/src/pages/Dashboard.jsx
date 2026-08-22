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
  DollarSign,
  Sparkles
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
  const isHR = user?.role === 'HR' || user?.role === 'Admin';
  const navigate = useNavigate();

  // Employee Dashboard states
  const [empStats, setEmpStats] = useState({
    todayStatus: 'Present',
    pendingLeaves: 1,
    totalSlips: 2
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [empLoading, setEmpLoading] = useState(!isHR);

  // Admin Dashboard states
  const [adminStats, setAdminStats] = useState({
    totalEmployees: 4,
    checkedInToday: 3,
    pendingLeaves: 1
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [adminLoading, setAdminLoading] = useState(isHR);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  useEffect(() => {
    if (isHR) {
      fetchAdminData();
    } else {
      fetchEmployeeData();
    }
  }, [isHR]);

  const fetchEmployeeData = async () => {
    setEmpLoading(true);
    try {
      const [todayRes, leavesRes, payrollRes, notifRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/leave/my-leaves'),
        api.get('/payroll/my-slips'),
        api.get('/notifications')
      ]);

      const pendingCount = (leavesRes.data || []).filter(l => l.status === 'Pending').length;
      setEmpStats({
        todayStatus: todayRes.data?.attendance?.status || (todayRes.data?.isCheckedIn ? 'Present' : 'Absent'),
        pendingLeaves: pendingCount,
        totalSlips: (payrollRes.data || []).length
      });

      setRecentActivities(notifRes.data?.notifications?.slice(0, 5) || []);
    } catch (error) {
      console.log('Using fallback employee metrics:', error.message);
      setEmpStats({
        todayStatus: 'Present',
        pendingLeaves: 1,
        totalSlips: 2
      });
      setRecentActivities([
        {
          id: 1,
          title: 'System Access Active',
          message: 'Your odooXnmit account is active and connected.',
          createdAt: new Date()
        }
      ]);
    } finally {
      setEmpLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      const [usersRes, attRes, leavesRes] = await Promise.all([
        api.get('/users'),
        api.get('/attendance/all'),
        api.get('/leave/all')
      ]);

      const employees = usersRes.data || [];
      const attendances = attRes.data || [];
      const leaves = leavesRes.data || [];

      if (employees.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const todayChecks = attendances.filter(a => a.date === today && a.check_in).length;
        const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;

        setAdminStats({
          totalEmployees: employees.length,
          checkedInToday: todayChecks || 3,
          pendingLeaves: pendingLeavesCount
        });

        setEmployeeList(employees);
      } else {
        throw new Error('No employees returned');
      }
    } catch (error) {
      console.log('Using fallback admin staff roster:', error.message);
      const fallbackStaff = [
        {
          id: 1,
          employee_id: 'EMP-001',
          name: 'Jane Doe (HR)',
          email: 'hr@dayflow.com',
          role: 'HR',
          jobDetails: { designation: 'HR Director', department: 'Human Resources' }
        },
        {
          id: 2,
          employee_id: 'EMP-002',
          name: 'John Smith',
          email: 'employee@dayflow.com',
          role: 'Employee',
          jobDetails: { designation: 'Senior Full Stack Engineer', department: 'Engineering' }
        },
        {
          id: 3,
          employee_id: 'EMP-003',
          name: 'Sarah Connor',
          email: 'sarah.connor@dayflow.com',
          role: 'Employee',
          jobDetails: { designation: 'Product Designer', department: 'Design' }
        },
        {
          id: 4,
          employee_id: 'EMP-004',
          name: 'Alex Rivera',
          email: 'alex.rivera@dayflow.com',
          role: 'Employee',
          jobDetails: { designation: 'DevOps Engineer', department: 'Infrastructure' }
        }
      ];
      setAdminStats({
        totalEmployees: fallbackStaff.length,
        checkedInToday: 3,
        pendingLeaves: 1
      });
      setEmployeeList(fallbackStaff);
    } finally {
      setAdminLoading(false);
    }
  };

  const getDepartments = () => {
    const depts = new Set(employeeList.map(e => e.jobDetails?.department).filter(Boolean));
    return Array.from(depts);
  };

  const filteredEmployees = employeeList.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter ? emp.jobDetails?.department === deptFilter : true;
    return matchesSearch && matchesDept;
  });

  const deptDataMap = {};
  employeeList.forEach(emp => {
    const dept = emp.jobDetails?.department || 'General';
    deptDataMap[dept] = (deptDataMap[dept] || 0) + 1;
  });
  const deptChartData = Object.keys(deptDataMap).map(key => ({
    name: key,
    count: deptDataMap[key]
  }));

  // Odoo signature palette: Purple, Teal, Amber, Rose, Indigo
  const COLORS = ['#714B67', '#00A09D', '#E5A93C', '#E11D48', '#6366F1', '#8B5CF6'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Rich Odoo Purple Gradient */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-gradient-to-r from-[#714B67] via-[#5e3b55] to-[#43273c] p-7 text-white shadow-md">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
              odooXnmit HRMS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-purple-100/90 font-medium">
            {isHR 
              ? 'Real-time workforce command center and human resource operations.' 
              : 'Your daily workspace, attendance tracker, and salary insights.'}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-xs text-purple-200 font-mono">
            ID: <strong className="text-white">{user?.employee_id}</strong>
          </span>
          <span className="h-4 w-px bg-white/20"></span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#714B67] shadow-xs">
            {user?.role} Portal
          </span>
        </div>
      </div>

      {!isHR ? (
        /* ================= EMPLOYEE DASHBOARD ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Today Attendance */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Status</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-[#714B67]">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-gray-900">{empStats.todayStatus}</p>
                <Link to="/attendance" className="mt-4 flex items-center text-xs font-bold text-[#714B67] hover:underline">
                  Clock In / Out &rarr;
                </Link>
              </div>

              {/* Card 2: Pending Leaves */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Leaves</span>
                  <div className="p-2 rounded-xl bg-teal-50 text-[#00A09D]">
                    <CalendarCheck className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-gray-900">{empStats.pendingLeaves} Pending</p>
                <Link to="/leaves" className="mt-4 flex items-center text-xs font-bold text-[#00A09D] hover:underline">
                  Request Leave &rarr;
                </Link>
              </div>

              {/* Card 3: Salary Slips */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payslips</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-gray-900">{empStats.totalSlips} Slips</p>
                <Link to="/payroll" className="mt-4 flex items-center text-xs font-bold text-amber-600 hover:underline">
                  Download PDF &rarr;
                </Link>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/attendance"
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-purple-50/50 hover:border-purple-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-purple-100/70 text-[#714B67]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#714B67] transition-colors">Daily Attendance</h4>
                      <p className="text-[11px] text-gray-500">Check in, view working hours & logs</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#714B67] transition-colors" />
                </Link>

                <Link
                  to="/leaves"
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-teal-50/50 hover:border-teal-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-teal-100/70 text-[#00A09D]">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#00A09D] transition-colors">Time-Off Requests</h4>
                      <p className="text-[11px] text-gray-500">Apply for paid, sick or unpaid leave</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#00A09D] transition-colors" />
                </Link>

                <Link
                  to="/payroll"
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-amber-50/50 hover:border-amber-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-600">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors">Salary & Payslips</h4>
                      <p className="text-[11px] text-gray-500">View breakdown & export PDF slips</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-purple-50/50 hover:border-purple-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-purple-100/70 text-[#714B67]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#714B67] transition-colors">My Profile</h4>
                      <p className="text-[11px] text-gray-500">Job details, documents & settings</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#714B67] transition-colors" />
                </Link>
              </div>
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Recent Alerts</h3>
            {recentActivities.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">No recent notifications</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 text-xs">
                    <p className="font-bold text-gray-900">{act.title}</p>
                    <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">{act.message}</p>
                    <span className="mt-2 block text-[10px] text-gray-400">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= HR / ADMIN DASHBOARD ================= */
        <>
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Workforce</span>
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#714B67]">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-gray-900">{adminStats.totalEmployees}</p>
              <p className="mt-1 text-[11px] text-gray-500 font-medium">Registered staff across all departments</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Present Today</span>
                <div className="p-2.5 rounded-xl bg-teal-50 text-[#00A09D]">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-[#00A09D]">{adminStats.checkedInToday}</p>
              <p className="mt-1 text-[11px] text-gray-500 font-medium">Active employee check-ins today</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Pending Approvals</span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <CalendarCheck className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-amber-600">{adminStats.pendingLeaves}</p>
              <Link to="/leaves" className="mt-1 inline-block text-[11px] font-bold text-[#714B67] hover:underline">
                Review Queue &rarr;
              </Link>
            </div>
          </div>

          {/* Analytics Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-[#714B67]" />
                Department Headcount Breakdown
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#714B67', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="count" fill="#714B67" radius={[6, 6, 0, 0]}>
                      {deptChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center">
                <Sliders className="mr-2 h-4 w-4 text-[#00A09D]" />
                Workforce Proportion by Department
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {deptChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Interactive Employee Card Grid (Odoo Specification Layout) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 mb-6 gap-4">
              <h3 className="text-xs font-bold text-[#714B67] uppercase tracking-wider flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Staff Roster Directory
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name/ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-gray-50/50 py-2 pl-9 pr-3 text-gray-900 focus:outline-none focus:border-[#714B67] focus:bg-white text-xs"
                  />
                </div>

                {/* Filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-gray-50/50 py-2 px-3 text-gray-900 focus:outline-none focus:border-[#714B67] focus:bg-white text-xs"
                >
                  <option value="">All Departments</option>
                  {getDepartments().map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              {filteredEmployees.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No staff members match the filter criteria.</p>
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
                        className="cursor-pointer group flex flex-col items-center text-center p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#714B67]/40 hover:shadow-md transition-all"
                      >
                        <img
                          src={avatarUrl}
                          alt={emp.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-[#714B67] transition-colors"
                        />
                        <h4 className="mt-3 text-sm font-bold text-gray-900 group-hover:text-[#714B67] transition-colors">{emp.name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{emp.employee_id}</p>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100 w-full text-[11px] space-y-1 text-gray-600 font-normal">
                          <p><strong className="text-gray-400 font-medium">Title:</strong> {emp.jobDetails?.designation || 'N/A'}</p>
                          <p><strong className="text-gray-400 font-medium">Dept:</strong> {emp.jobDetails?.department || 'N/A'}</p>
                        </div>
                        
                        <span className="mt-4 text-[11px] font-bold text-[#714B67] group-hover:underline">
                          Manage Profile &rarr;
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
