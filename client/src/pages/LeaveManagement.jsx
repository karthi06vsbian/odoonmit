import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CalendarClock, FilePlus2, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export const LeaveManagement = () => {
  const { user, fetchNotifications } = useAuth();
  const isHR = user?.role === 'HR';

  // Apply Leave form state
  const [formData, setFormData] = useState({
    leave_type: 'Paid',
    start_date: '',
    end_date: '',
    remarks: ''
  });
  const [applying, setApplying] = useState(false);

  // Leave Logs (Employee/HR)
  const [myLeaves, setMyLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Review (HR) modal/comment state
  const [reviewingId, setReviewingId] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoadingList(true);
    try {
      if (isHR) {
        const resAll = await api.get('/leave/all');
        setAllLeaves(resAll.data);
      }
      const resMy = await api.get('/leave/my-leaves');
      setMyLeaves(resMy.data);
    } catch (error) {
      toast.error('Failed to load leave records');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const { leave_type, start_date, end_date, remarks } = formData;

    if (!start_date || !end_date) {
      return toast.error('Please specify the date range');
    }

    if (new Date(end_date) < new Date(start_date)) {
      return toast.error('End date cannot be earlier than start date');
    }

    setApplying(true);
    try {
      const res = await api.post('/leave/apply', { leave_type, start_date, end_date, remarks });
      toast.success(res.data.message);
      
      // Reset form and reload list
      setFormData({
        leave_type: 'Paid',
        start_date: '',
        end_date: '',
        remarks: ''
      });
      fetchLeaves();
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setApplying(false);
    }
  };

  const handleReviewLeave = async (id, status) => {
    setReviewLoading(true);
    try {
      const res = await api.put(`/leave/review/${id}`, {
        status,
        admin_comment: adminComment
      });
      toast.success(res.data.message);
      
      // Reset states and refresh
      setReviewingId(null);
      setAdminComment('');
      fetchLeaves();
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update leave status');
    } finally {
      setReviewLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-rose-500/10 text-rose-400"><XCircle className="h-3 w-3 mr-1" />Rejected</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-amber-500/10 text-amber-400"><Clock className="h-3 w-3 mr-1" />Pending</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Leave & Time-Off</h2>
        <p className="text-xs text-slate-400 font-medium">Apply for leaves, track approvals, and check balances.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Apply Leave Form */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg h-fit">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center">
            <FilePlus2 className="mr-2 h-4.5 w-4.5" />
            Apply for Leave
          </h3>

          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Leave Type
              </label>
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Paid" className="bg-slate-900">Paid Leave</option>
                <option value="Sick" className="bg-slate-900">Sick Leave</option>
                <option value="Unpaid" className="bg-slate-900">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2.5 px-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Remarks / Purpose
              </label>
              <textarea
                name="remarks"
                rows={4}
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Reason for requesting leave..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={applying}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/10 transition-colors disabled:opacity-50"
            >
              {applying ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Approval Queue & My Requests list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HR Pending Approvals Queue */}
          {isHR && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center pb-3 border-b border-slate-800">
                <AlertTriangle className="mr-2 h-4.5 w-4.5 text-amber-500" />
                Pending Leave Approvals Queue
              </h3>

              <div className="space-y-4">
                {loadingList ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                  </div>
                ) : allLeaves.filter(l => l.status === 'Pending').length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No pending leave requests in queue.</p>
                ) : (
                  allLeaves.filter(l => l.status === 'Pending').map((request) => (
                    <div key={request.id} className="rounded-lg bg-slate-950/40 border border-slate-800 p-4 space-y-3.5 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block font-bold text-slate-100">{request.user?.name}</span>
                          <span className="block text-xxs text-slate-500">{request.user?.employee_id} • {request.user?.jobDetails?.department}</span>
                        </div>
                        <span className="inline-flex px-2 py-0.5 rounded text-xxs font-semibold bg-blue-500/10 text-blue-400 capitalize">
                          {request.leave_type} Leave
                        </span>
                      </div>

                      <div className="text-slate-300 bg-slate-950/30 p-2.5 rounded border border-slate-900 font-normal">
                        <p className="font-semibold text-slate-400 mb-1">Remarks:</p>
                        "{request.remarks}"
                      </div>

                      <div className="flex justify-between items-center text-xxs text-slate-400">
                        <span>Duration: <strong className="text-slate-200">{formatDate(request.start_date)}</strong> to <strong className="text-slate-200">{formatDate(request.end_date)}</strong></span>
                      </div>

                      {/* Approval Box */}
                      {reviewingId === request.id ? (
                        <div className="space-y-3 pt-2 border-t border-slate-900">
                          <textarea
                            rows={2}
                            placeholder="Add comments or review feedback (optional)..."
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                            className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-white placeholder-slate-700 focus:outline-none focus:border-blue-500"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setReviewingId(null)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReviewLeave(request.id, 'Rejected')}
                              disabled={reviewLoading}
                              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleReviewLeave(request.id, 'Approved')}
                              disabled={reviewLoading}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end border-t border-slate-900/60 pt-2.5">
                          <button
                            onClick={() => setReviewingId(request.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xxs transition-colors"
                          >
                            Review & Decide
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* My Leave Requests log */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center pb-3 border-b border-slate-800">
              <CalendarClock className="mr-2 h-4.5 w-4.5" />
              My Time-Off Applications
            </h3>

            <div className="overflow-x-auto text-xs">
              {loadingList ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500"></div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5">Leave Type</th>
                      <th className="py-2.5">Start Date</th>
                      <th className="py-2.5">End Date</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Approver Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {myLeaves.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">You haven't submitted any leave applications.</td>
                      </tr>
                    ) : (
                      myLeaves.map((leave) => (
                        <tr key={leave.id} className="hover:bg-slate-850/20">
                          <td className="py-2.5 font-semibold text-slate-200 capitalize">{leave.leave_type} Leave</td>
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
    </div>
  );
};

export default LeaveManagement;
