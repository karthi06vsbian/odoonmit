import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CreditCard, FileDown, PlusCircle, Search, User } from 'lucide-react';

export const Payroll = () => {
  const { user } = useAuth();
  const isHR = user?.role === 'HR';

  // State for Employee view
  const [mySlips, setMySlips] = useState([]);
  const [loadingMy, setLoadingMy] = useState(true);

  // State for HR view
  const [allSlips, setAllSlips] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [hrSearchQuery, setHrSearchQuery] = useState('');

  // Form state for creating/updating payroll
  const [formData, setFormData] = useState({
    user_id: '',
    basic_salary: '',
    allowances: '',
    deductions: '',
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear()
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployeeData = async () => {
    try {
      const res = await api.get('/users');
      // Filter out HR users if desired, or keep all
      setEmployees(res.data.filter(u => u.role === 'Employee'));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPayrollData = async () => {
    try {
      if (isHR) {
        setLoadingAll(true);
        const resAll = await api.get('/payroll/all');
        setAllSlips(resAll.data);
      }
      
      setLoadingMy(true);
      const resMy = await api.get('/payroll/my-payroll');
      setMySlips(resMy.data);
    } catch (error) {
      toast.error('Failed to retrieve payroll history');
    } finally {
      setLoadingMy(false);
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
    if (isHR) {
      fetchEmployeeData();
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayrollSubmit = async (e) => {
    e.preventDefault();
    const { user_id, basic_salary, allowances, deductions, month, year } = formData;

    if (!user_id || basic_salary === '' || allowances === '' || deductions === '') {
      return toast.error('All fields are required');
    }

    setSubmitting(true);
    try {
      const res = await api.post('/payroll/update', {
        user_id: parseInt(user_id),
        basic_salary: parseFloat(basic_salary),
        allowances: parseFloat(allowances),
        deductions: parseFloat(deductions),
        month: parseInt(month),
        year: parseInt(year)
      });
      toast.success(res.data.message);
      
      // Reset form (except month/year) and reload lists
      setFormData(prev => ({
        ...prev,
        user_id: '',
        basic_salary: '',
        allowances: '',
        deductions: ''
      }));
      fetchPayrollData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update payroll structure');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPayslip = async (slipId) => {
    try {
      // Fetch token to append since raw window.open doesn't include Auth Headers
      const token = localStorage.getItem('accessToken');
      const downloadUrl = `http://localhost:5001/api/payroll/download/${slipId}?token=${token}`;
      
      // Instead of raw window.open, we can fetch via axios to get blob or open with token in URL query
      // Our backend middleware parses token from query if headers is missing
      window.open(downloadUrl, '_blank');
    } catch (error) {
      toast.error('Failed to download payslip PDF');
    }
  };

  const getMonthName = (monthNum) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1] || monthNum;
  };

  // Live Net Salary calculation
  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const allow = parseFloat(formData.allowances) || 0;
    const deduct = parseFloat(formData.deductions) || 0;
    return (basic + allow - deduct).toFixed(2);
  };

  const filteredSlips = allSlips.filter(s => 
    s.user?.name?.toLowerCase().includes(hrSearchQuery.toLowerCase()) ||
    s.user?.employee_id?.toLowerCase().includes(hrSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Payroll & Salary Slips</h2>
        <p className="text-xs text-slate-400 font-medium">Verify salary structures and download monthly payslips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: HR Update Form (if HR) */}
        {isHR && (
          <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg h-fit">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center">
              <PlusCircle className="mr-2 h-4.5 w-4.5" />
              Adjust Salary Structure
            </h3>

            <form onSubmit={handlePayrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Employee
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-slate-900">
                      {emp.name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Pay Month
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white focus:outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-slate-900">
                        {getMonthName(i + 1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Pay Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white focus:outline-none"
                  >
                    <option value={2026} className="bg-slate-900">2026</option>
                    <option value={2025} className="bg-slate-900">2025</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Basic Salary ($)
                </label>
                <input
                  type="number"
                  name="basic_salary"
                  value={formData.basic_salary}
                  onChange={handleInputChange}
                  placeholder="5000"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Allowances ($)
                  </label>
                  <input
                    type="number"
                    name="allowances"
                    value={formData.allowances}
                    onChange={handleInputChange}
                    placeholder="1000"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Deductions ($)
                  </label>
                  <input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleInputChange}
                    placeholder="200"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white"
                    required
                  />
                </div>
              </div>

              {/* Calculated Salary Field */}
              <div className="rounded-lg bg-blue-600/10 border border-blue-500/20 p-3 flex justify-between items-center">
                <span className="font-semibold text-blue-400">Net Salary:</span>
                <span className="text-base font-bold text-white">${calculateNetSalary()}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 shadow-lg transition-colors"
              >
                {submitting ? 'Updating...' : 'Save & Publish Slip'}
              </button>
            </form>
          </div>
        )}

        {/* Right Column: List of Payslips */}
        <div className={isHR ? 'lg:col-span-2 space-y-6' : 'lg:col-span-3 space-y-6'}>
          
          {/* HR View: All staff salary slips list */}
          {isHR && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 mb-6 gap-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center">
                  <User className="mr-2 h-4.5 w-4.5" />
                  Staff Payroll Log
                </h3>

                <div className="relative text-xs">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by Employee..."
                    value={hrSearchQuery}
                    onChange={(e) => setHrSearchQuery(e.target.value)}
                    className="rounded border border-slate-800 bg-slate-950/40 py-1.5 pl-8 pr-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto text-xs">
                {loadingAll ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-2.5">Emp ID</th>
                        <th className="py-2.5">Name</th>
                        <th className="py-2.5">Period</th>
                        <th className="py-2.5">Net Salary</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {filteredSlips.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">No payroll records logged yet.</td>
                        </tr>
                      ) : (
                        filteredSlips.map((slip) => (
                          <tr key={slip.id} className="hover:bg-slate-850/20">
                            <td className="py-2.5 font-medium text-slate-400">{slip.user?.employee_id}</td>
                            <td className="py-2.5 font-semibold text-slate-100">{slip.user?.name}</td>
                            <td className="py-2.5">{getMonthName(slip.month)} {slip.year}</td>
                            <td className="py-2.5 font-bold text-emerald-400">${parseFloat(slip.net_salary).toFixed(2)}</td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => handleDownloadPayslip(slip.id)}
                                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
                              >
                                <FileDown className="mr-1 h-3.5 w-3.5" />
                                PDF
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Employee view: Personal payslips list */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center pb-3 border-b border-slate-800">
              <CreditCard className="mr-2 h-4.5 w-4.5" />
              My Salary Slips
            </h3>

            <div className="overflow-x-auto text-xs">
              {loadingMy ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5">Period</th>
                      <th className="py-2.5">Basic Salary</th>
                      <th className="py-2.5">Allowances</th>
                      <th className="py-2.5">Deductions</th>
                      <th className="py-2.5">Net Salary</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {mySlips.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">No payslips issued yet.</td>
                      </tr>
                    ) : (
                      mySlips.map((slip) => (
                        <tr key={slip.id} className="hover:bg-slate-850/20">
                          <td className="py-2.5 font-semibold text-slate-200">{getMonthName(slip.month)} {slip.year}</td>
                          <td className="py-2.5">${parseFloat(slip.basic_salary).toFixed(2)}</td>
                          <td className="py-2.5 text-emerald-400">+${parseFloat(slip.allowances).toFixed(2)}</td>
                          <td className="py-2.5 text-rose-400">-${parseFloat(slip.deductions).toFixed(2)}</td>
                          <td className="py-2.5 font-bold text-white">${parseFloat(slip.net_salary).toFixed(2)}</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleDownloadPayslip(slip.id)}
                              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold bg-blue-600/10 hover:bg-blue-600/20 px-2 py-1 rounded transition-colors"
                            >
                              <FileDown className="mr-1 h-3.5 w-3.5" />
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
