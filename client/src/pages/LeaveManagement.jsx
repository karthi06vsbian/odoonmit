import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  CalendarCheck, 
  Plus, 
  Check, 
  X, 
  Clock, 
  FileText, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const LeaveManagement = () => {
  const { user, isHR } = useAuth();

  // Leaves state
  const [myLeaves, setMyLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Application Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'Paid',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Approval action comment state
  const [actionComments, setActionComments] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, [isHR]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      if (isHR) {
        const resAll = await api.get('/leave/all');
        setAllLeaves(resAll.data || []);
      }
      const resMy = await api.get('/leave/my-leaves');
      setMyLeaves(resMy.data || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date) {
      return toast.error('Please select both start and end dates');
    }

    setSubmitting(true);
    try {
      const res = await api.post('/leave/apply', formData);
      toast.success(res.data.message || 'Leave application submitted!');
      setShowModal(false);
      setFormData({ leave_type: 'Paid', start_date: '', end_date: '', reason: '' });
      fetchLeaves();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewAction = async (leaveId, status) => {
    const admin_comment = actionComments[leaveId] || '';
    try {
      const res = await api.put(`/leave/${leaveId}/review`, { status, admin_comment });
      toast.success(res.data.message || `Leave request ${status}`);
      fetchLeaves();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <Clock className="mr-1 h-3 w-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
            <CalendarCheck className="mr-2.5 h-6 w-6 text-emerald-500" />
            Time-Off & Leave Management
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Request time off, monitor leave balances, and review team approval queues.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">New Leave Application</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Leave Type
                </label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Paid">Paid Vacation Leave</option>
                  <option value="Sick">Sick / Medical Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reason / Remarks
                </label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Provide context or handover details for your request..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 py-2 px-4 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 py-2 px-4 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="space-y-6">
        {/* HR Approval Queue Section (Visible only to HR/Admin) */}
        {isHR && (
          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/80 p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Staff Leave Approvals Queue (HR Action)
                </h3>
                <p className="text-xxs text-slate-400 mt-0.5">Approve or reject employee time-off applications with comments</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {allLeaves.filter(l => l.status === 'Pending').length} Pending
              </span>
            </div>

            <div className="overflow-x-auto text-xs font-normal">
              {allLeaves.length === 0 ? (
                <p className="text-center py-8 text-slate-500">No leave requests have been submitted yet.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5">Staff Name</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Duration</th>
                      <th className="py-2.5">Dates</th>
                      <th className="py-2.5">Reason</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {allLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-850/20">
                        <td className="py-3">
                          <p className="font-semibold text-slate-100">{leave.user?.name || 'Staff'}</p>
                          <p className="text-xxs text-slate-500">{leave.user?.employee_id} • {leave.user?.jobDetails?.department}</p>
                        </td>
                        <td className="py-3">
                          <span className="font-medium text-slate-300 capitalize">{leave.leave_type} Leave</span>
                        </td>
                        <td className="py-3 font-mono">{leave.days_count} day(s)</td>
                        <td className="py-3 text-slate-400">{leave.start_date} to {leave.end_date}</td>
                        <td className="py-3 text-xxs text-slate-400 max-w-xs truncate" title={leave.reason}>
                          {leave.reason || 'No remarks provided'}
                        </td>
                        <td className="py-3">{getStatusBadge(leave.status)}</td>
                        <td className="py-3 text-right">
                          {leave.status === 'Pending' ? (
                            <div className="flex items-center justify-end space-x-2">
                              <input
                                type="text"
                                placeholder="Add remark..."
                                value={actionComments[leave.id] || ''}
                                onChange={(e) => setActionComments({ ...actionComments, [leave.id]: e.target.value })}
                                className="rounded border border-slate-700 bg-slate-950/60 py-1 px-2 text-xxs text-white w-28 focus:outline-none"
                              />
                              <button
                                onClick={() => handleReviewAction(leave.id, 'Approved')}
                                className="rounded bg-emerald-600 hover:bg-emerald-500 p-1 text-white shadow transition-colors"
                                title="Approve Leave"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleReviewAction(leave.id, 'Rejected')}
                                className="rounded bg-rose-600 hover:bg-rose-500 p-1 text-white shadow transition-colors"
                                title="Reject Leave"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xxs text-slate-500 italic">
                              {leave.admin_comment ? `Remark: "${leave.admin_comment}"` : 'Completed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Employee's Own Leave History */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-blue-400" />
              My Time-Off Requests
            </h3>
            <span className="text-xxs text-slate-500">Historical History</span>
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
                    <th className="py-2.5">Leave Type</th>
                    <th className="py-2.5">Duration</th>
                    <th className="py-2.5">Start Date</th>
                    <th className="py-2.5">End Date</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Approver Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {myLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">You haven't submitted any leave applications yet.</td>
                    </tr>
                  ) : (
                    myLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-850/20">
                        <td className="py-2.5 font-semibold text-slate-200 capitalize">{leave.leave_type} Leave</td>
                        <td className="py-2.5 font-mono">{leave.days_count} day(s)</td>
                        <td className="py-2.5">{leave.start_date}</td>
                        <td className="py-2.5">{leave.end_date}</td>
                        <td className="py-2.5">{getStatusBadge(leave.status)}</td>
                        <td className="py-2.5 text-right text-xxs text-slate-400 italic font-normal truncate max-w-xs" title={leave.admin_comment}>
                          {leave.admin_comment || '-'}
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
  );
};

export default LeaveManagement;
