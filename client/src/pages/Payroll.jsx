import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  DollarSign, 
  Download, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  Edit3, 
  Check, 
  X,
  Users
} from 'lucide-react';

export const Payroll = () => {
  const { user, isHR } = useAuth();

  const [mySlips, setMySlips] = useState([]);
  const [allSlips, setAllSlips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit/Update Salary Structure Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    user_id: '',
    basic_salary: '',
    allowances: '',
    deductions: '',
    payment_status: 'Paid'
  });
  const [savingSalary, setSavingSalary] = useState(false);

  useEffect(() => {
    fetchPayrollData();
  }, [isHR]);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      if (isHR) {
        const [allRes, usersRes] = await Promise.all([
          api.get('/payroll/all'),
          api.get('/users')
        ]);
        setAllSlips(allRes.data || []);
        setEmployees(usersRes.data || []);
      }
      const myRes = await api.get('/payroll/my-slips');
      setMySlips(myRes.data || []);
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (slipId, empId, month, year) => {
    try {
      const response = await api.get(`/payroll/payslip/${slipId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${empId || 'Employee'}_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Payslip downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error downloading payslip PDF');
    }
  };

  const handleSalaryUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.user_id || !editFormData.basic_salary) {
      return toast.error('Please select an employee and specify the basic salary');
    }

    setSavingSalary(true);
    try {
      const res = await api.post('/payroll/structure', editFormData);
      toast.success(res.data.message || 'Salary structure saved!');
      setShowEditModal(false);
      fetchPayrollData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update salary structure');
    } finally {
      setSavingSalary(false);
    }
  };

  const latestSlip = mySlips[0] || null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
            <DollarSign className="mr-2.5 h-6 w-6 text-amber-500" />
            Payroll & Salary Slips
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Transparent salary structures, itemized pay calculations, and downloadable payslips.
          </p>
        </div>

        {isHR && (
          <button
            onClick={() => {
              setEditFormData({
                user_id: employees[0]?.id || '',
                basic_salary: 5000,
                allowances: 500,
                deductions: 200,
                payment_status: 'Paid'
              });
              setShowEditModal(true);
            }}
            className="flex items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all"
          >
            <Edit3 className="mr-1.5 h-4 w-4" />
            Update Salary Structure
          </button>
        )}
      </div>

      {/* Salary Structure Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Configure Staff Salary</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSalaryUpdateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Employee
                </label>
                <select
                  value={editFormData.user_id}
                  onChange={(e) => setEditFormData({ ...editFormData, user_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-slate-900">
                      {emp.name} ({emp.employee_id} - {emp.jobDetails?.department || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Basic Salary ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.basic_salary}
                  onChange={(e) => setEditFormData({ ...editFormData, basic_salary: e.target.value })}
                  placeholder="5000.00"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Allowances ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.allowances}
                    onChange={(e) => setEditFormData({ ...editFormData, allowances: e.target.value })}
                    placeholder="500.00"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Deductions ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.deductions}
                    onChange={(e) => setEditFormData({ ...editFormData, deductions: e.target.value })}
                    placeholder="200.00"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={editFormData.payment_status}
                  onChange={(e) => setEditFormData({ ...editFormData, payment_status: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg border border-slate-700 py-2 px-4 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSalary}
                  className="rounded-lg bg-amber-600 py-2 px-4 text-xs font-bold text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {savingSalary ? 'Saving...' : 'Save Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Overview Card */}
      {latestSlip && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Basic Salary</span>
            <p className="mt-2 text-xl font-bold text-white">${parseFloat(latestSlip.basic_salary).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xxs font-bold text-emerald-400 uppercase tracking-wider">Allowances</span>
            <p className="mt-2 text-xl font-bold text-emerald-400">+${parseFloat(latestSlip.allowances).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <span className="text-xxs font-bold text-rose-400 uppercase tracking-wider">Deductions</span>
            <p className="mt-2 text-xl font-bold text-rose-400">-${parseFloat(latestSlip.deductions).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 shadow-lg">
            <span className="text-xxs font-bold text-blue-400 uppercase tracking-wider">Net Payable</span>
            <p className="mt-2 text-2xl font-black text-white">${parseFloat(latestSlip.net_salary).toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* HR All-Workforce Payroll Control Table */}
      {isHR && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Company Payroll Registry (HR Master View)
            </h3>
            <span className="text-xxs text-slate-500">{allSlips.length} Total Records</span>
          </div>

          <div className="overflow-x-auto text-xs font-normal">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-2.5">Staff Name</th>
                  <th className="py-2.5">Month/Year</th>
                  <th className="py-2.5">Basic</th>
                  <th className="py-2.5">Allowances</th>
                  <th className="py-2.5">Deductions</th>
                  <th className="py-2.5">Net Pay</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {allSlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-850/20">
                    <td className="py-3">
                      <p className="font-semibold text-white">{slip.user?.name || 'Staff'}</p>
                      <p className="text-xxs text-slate-500">{slip.user?.employee_id}</p>
                    </td>
                    <td className="py-3 font-mono">{slip.month}/{slip.year}</td>
                    <td className="py-3">${parseFloat(slip.basic_salary).toFixed(2)}</td>
                    <td className="py-3 text-emerald-400">+${parseFloat(slip.allowances).toFixed(2)}</td>
                    <td className="py-3 text-rose-400">-${parseFloat(slip.deductions).toFixed(2)}</td>
                    <td className="py-3 font-bold text-white">${parseFloat(slip.net_salary).toFixed(2)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-xxs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {slip.payment_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDownloadPDF(slip.id, slip.user?.employee_id, slip.month, slip.year)}
                        className="inline-flex items-center space-x-1 rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xxs font-semibold text-blue-400 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Personal Payslip History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
            <FileText className="mr-2 h-4 w-4 text-blue-400" />
            My Monthly Payslips
          </h3>
          <span className="text-xxs text-slate-500">Official Slips</span>
        </div>

        <div className="overflow-x-auto text-xs font-normal">
          {loading ? (
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
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Download Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {mySlips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">No payslip records found.</td>
                  </tr>
                ) : (
                  mySlips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-slate-850/20">
                      <td className="py-3 font-semibold text-slate-100">Month {slip.month}, {slip.year}</td>
                      <td className="py-3 font-mono">${parseFloat(slip.basic_salary).toFixed(2)}</td>
                      <td className="py-3 text-emerald-400 font-mono">+${parseFloat(slip.allowances).toFixed(2)}</td>
                      <td className="py-3 text-rose-400 font-mono">-${parseFloat(slip.deductions).toFixed(2)}</td>
                      <td className="py-3 font-bold text-white font-mono">${parseFloat(slip.net_salary).toFixed(2)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-xxs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {slip.payment_status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDownloadPDF(slip.id, user?.employee_id, slip.month, slip.year)}
                          className="inline-flex items-center space-x-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xxs font-bold text-white shadow transition-all"
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF Payslip</span>
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
  );
};

export default Payroll;
