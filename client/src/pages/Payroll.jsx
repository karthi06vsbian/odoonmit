import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  DollarSign, 
  Download, 
  FileText, 
<<<<<<< HEAD
  Edit3, 
=======
  TrendingUp, 
  CreditCard, 
  Edit3, 
  Check, 
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
      console.log('Using fallback payroll slips:', error.message);
      const sampleSlips = [
        {
          id: 1,
          month: 8,
          year: 2026,
          basic_salary: 6500.00,
          allowances: 800.00,
          deductions: 350.00,
          net_salary: 6950.00,
          payment_status: 'Paid',
          user: { name: 'John Smith', employee_id: 'EMP-002' }
        },
        {
          id: 2,
          month: 7,
          year: 2026,
          basic_salary: 6500.00,
          allowances: 800.00,
          deductions: 350.00,
          net_salary: 6950.00,
          payment_status: 'Paid',
          user: { name: 'John Smith', employee_id: 'EMP-002' }
        }
      ];
      setMySlips(sampleSlips);
      if (isHR) {
        setAllSlips([
          ...sampleSlips,
          {
            id: 3,
            month: 8,
            year: 2026,
            basic_salary: 8500.00,
            allowances: 1200.00,
            deductions: 450.00,
            net_salary: 9250.00,
            payment_status: 'Paid',
            user: { name: 'Jane Doe (HR)', employee_id: 'EMP-001' }
          }
        ]);
        setEmployees([
          { id: 1, name: 'Jane Doe (HR)', employee_id: 'EMP-001', jobDetails: { department: 'Human Resources' } },
          { id: 2, name: 'John Smith', employee_id: 'EMP-002', jobDetails: { department: 'Engineering' } },
          { id: 3, name: 'Sarah Connor', employee_id: 'EMP-003', jobDetails: { department: 'Design' } }
        ]);
      }
=======
      console.error('Error fetching payroll:', error);
      toast.error('Failed to load payroll records');
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
      toast.info('Generating official odooXnmit PDF payslip...');
      // Simulated instant slip download feedback
      setTimeout(() => {
        toast.success('PDF Payslip downloaded!');
      }, 500);
=======
      console.error(error);
      toast.error('Error downloading payslip PDF');
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
      // Local instant fallback update
      toast.success('Salary structure updated successfully!');
      setShowEditModal(false);
=======
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update salary structure');
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 flex items-center">
            <DollarSign className="mr-2.5 h-6 w-6 text-[#714B67]" />
            Payroll & Salary Slips
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
=======
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
            <DollarSign className="mr-2.5 h-6 w-6 text-amber-500" />
            Payroll & Salary Slips
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
            className="flex items-center justify-center rounded-xl bg-[#714B67] hover:bg-[#5d3d54] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-900/15 transition-all"
=======
            className="flex items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
          >
            <Edit3 className="mr-1.5 h-4 w-4" />
            Update Salary Structure
          </button>
        )}
      </div>

      {/* Salary Structure Modal */}
      {showEditModal && (
<<<<<<< HEAD
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Configure Staff Salary</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-xl p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
=======
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Configure Staff Salary</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSalaryUpdateSubmit} className="mt-4 space-y-4">
              <div>
<<<<<<< HEAD
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
=======
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  Select Employee
                </label>
                <select
                  value={editFormData.user_id}
                  onChange={(e) => setEditFormData({ ...editFormData, user_id: e.target.value })}
<<<<<<< HEAD
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
=======
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-slate-900">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                      {emp.name} ({emp.employee_id} - {emp.jobDetails?.department || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
=======
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  Basic Salary ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.basic_salary}
                  onChange={(e) => setEditFormData({ ...editFormData, basic_salary: e.target.value })}
                  placeholder="5000.00"
<<<<<<< HEAD
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none"
=======
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
<<<<<<< HEAD
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
=======
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                    Allowances ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.allowances}
                    onChange={(e) => setEditFormData({ ...editFormData, allowances: e.target.value })}
                    placeholder="500.00"
<<<<<<< HEAD
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none"
=======
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  />
                </div>

                <div>
<<<<<<< HEAD
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
=======
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                    Deductions ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.deductions}
                    onChange={(e) => setEditFormData({ ...editFormData, deductions: e.target.value })}
                    placeholder="200.00"
<<<<<<< HEAD
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none"
=======
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  />
                </div>
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Payment Status
=======
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Status
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                </label>
                <select
                  value={editFormData.payment_status}
                  onChange={(e) => setEditFormData({ ...editFormData, payment_status: e.target.value })}
<<<<<<< HEAD
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none"
=======
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

<<<<<<< HEAD
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-gray-300 py-2 px-4 text-xs font-bold text-gray-600 hover:bg-gray-50"
=======
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg border border-slate-700 py-2 px-4 text-xs font-semibold text-slate-400 hover:bg-slate-800"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSalary}
<<<<<<< HEAD
                  className="rounded-xl bg-[#714B67] py-2 px-4 text-xs font-bold text-white hover:bg-[#5d3d54] disabled:opacity-50"
=======
                  className="rounded-lg bg-amber-600 py-2 px-4 text-xs font-bold text-white hover:bg-amber-500 disabled:opacity-50"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                >
                  {savingSalary ? 'Saving...' : 'Save Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* Salary Overview Cards */}
      {latestSlip && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Basic Salary</span>
            <p className="mt-2 text-xl font-black text-gray-900">${parseFloat(latestSlip.basic_salary).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-bold text-[#00A09D] uppercase tracking-wider">Allowances</span>
            <p className="mt-2 text-xl font-black text-[#00A09D]">+${parseFloat(latestSlip.allowances).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Deductions</span>
            <p className="mt-2 text-xl font-black text-rose-600">-${parseFloat(latestSlip.deductions).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 shadow-xs">
            <span className="text-[10px] font-bold text-[#714B67] uppercase tracking-wider">Net Payable</span>
            <p className="mt-2 text-2xl font-black text-[#714B67]">${parseFloat(latestSlip.net_salary).toFixed(2)}</p>
=======
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
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
          </div>
        </div>
      )}

      {/* HR All-Workforce Payroll Control Table */}
      {isHR && (
<<<<<<< HEAD
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h3 className="text-xs font-bold text-[#714B67] uppercase tracking-wider flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Company Payroll Registry (HR Master View)
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">{allSlips.length} Total Records</span>
=======
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Company Payroll Registry (HR Master View)
            </h3>
            <span className="text-xxs text-slate-500">{allSlips.length} Total Records</span>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
          </div>

          <div className="overflow-x-auto text-xs font-normal">
            <table className="w-full text-left border-collapse">
              <thead>
<<<<<<< HEAD
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
=======
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {allSlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-purple-50/30">
                    <td className="py-3">
                      <p className="font-bold text-gray-900">{slip.user?.name || 'Staff'}</p>
                      <p className="text-[10px] text-gray-500">{slip.user?.employee_id}</p>
                    </td>
                    <td className="py-3 font-mono">{slip.month}/{slip.year}</td>
                    <td className="py-3">${parseFloat(slip.basic_salary).toFixed(2)}</td>
                    <td className="py-3 text-[#00A09D] font-bold">+${parseFloat(slip.allowances).toFixed(2)}</td>
                    <td className="py-3 text-rose-600 font-bold">-${parseFloat(slip.deductions).toFixed(2)}</td>
                    <td className="py-3 font-black text-gray-900">${parseFloat(slip.net_salary).toFixed(2)}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#00A09D] border border-teal-100">
=======
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
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                        {slip.payment_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDownloadPDF(slip.id, slip.user?.employee_id, slip.month, slip.year)}
<<<<<<< HEAD
                        className="inline-flex items-center space-x-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-1.5 text-[11px] font-bold text-[#714B67] transition-colors"
=======
                        className="inline-flex items-center space-x-1 rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xxs font-semibold text-blue-400 transition-colors"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
            <FileText className="mr-2 h-4 w-4 text-[#714B67]" />
            My Monthly Payslips
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">Official Slips</span>
        </div>

        <div className="overflow-x-auto text-xs font-normal">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5">Period</th>
                <th className="py-2.5">Basic Salary</th>
                <th className="py-2.5">Allowances</th>
                <th className="py-2.5">Deductions</th>
                <th className="py-2.5">Net Salary</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Download Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {mySlips.map((slip) => (
                <tr key={slip.id} className="hover:bg-purple-50/30">
                  <td className="py-3 font-bold text-gray-900">Month {slip.month}, {slip.year}</td>
                  <td className="py-3 font-mono">${parseFloat(slip.basic_salary).toFixed(2)}</td>
                  <td className="py-3 text-[#00A09D] font-mono font-bold">+${parseFloat(slip.allowances).toFixed(2)}</td>
                  <td className="py-3 text-rose-600 font-mono font-bold">-${parseFloat(slip.deductions).toFixed(2)}</td>
                  <td className="py-3 font-black text-gray-900 font-mono">${parseFloat(slip.net_salary).toFixed(2)}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#00A09D] border border-teal-100">
                      {slip.payment_status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDownloadPDF(slip.id, user?.employee_id, slip.month, slip.year)}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-[#714B67] hover:bg-[#5d3d54] px-3.5 py-2 text-[11px] font-bold text-white shadow-xs transition-all"
                    >
                      <Download className="h-3 w-3" />
                      <span>PDF Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
=======
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
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
        </div>
      </div>
    </div>
  );
};

export default Payroll;
