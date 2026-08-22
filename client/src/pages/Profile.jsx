import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Upload, 
  Save, 
  ShieldCheck,
  Building,
  DollarSign
} from 'lucide-react';

export const Profile = () => {
  const { id: paramId } = useParams();
  const { user: currentUser, isHR } = useAuth();

  const targetId = paramId || currentUser?.id;
  const isEditingOther = isHR && paramId && parseInt(paramId, 10) !== currentUser?.id;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'Employee',
    designation: '',
    department: '',
    joining_date: '',
    employment_type: 'Full-time'
  });

  useEffect(() => {
    if (targetId) {
      fetchProfile();
    }
  }, [targetId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${targetId}`);
      const data = res.data;
      setProfileData(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        role: data.role || 'Employee',
        designation: data.jobDetails?.designation || '',
        department: data.jobDetails?.department || '',
        joining_date: data.jobDetails?.joining_date || '',
        employment_type: data.jobDetails?.employment_type || 'Full-time'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        phone: formData.phone,
        address: formData.address
      };

      if (isHR) {
        payload.name = formData.name;
        payload.email = formData.email;
        payload.role = formData.role;
        payload.jobDetails = {
          designation: formData.designation,
          department: formData.department,
          joining_date: formData.joining_date,
          employment_type: formData.employment_type
        };
      }

      const res = await api.put(`/users/${targetId}`, payload);
      toast.success(res.data.message || 'Profile saved successfully!');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    setAvatarUploading(true);
    try {
      const res = await api.post(`/users/${targetId}/avatar`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Avatar updated successfully!');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload profile picture');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const avatarUrl = profileData?.profile_pic 
    ? `http://localhost:5001/${profileData.profile_pic}` 
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
          <UserIcon className="mr-2.5 h-6 w-6 text-blue-500" />
          {isEditingOther ? `Staff Profile: ${profileData?.name}` : 'My Employee Profile'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Personal contact details, organizational job roles, and workforce status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl text-center backdrop-blur-md">
            <div className="relative mx-auto w-28 h-28">
              <img
                src={avatarUrl}
                alt={profileData?.name}
                className="w-full h-full rounded-full object-cover border-4 border-slate-800 shadow-xl"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg transition-transform hover:scale-110"
                title="Change Avatar"
              >
                <Upload className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="mt-4 text-base font-bold text-white">{profileData?.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{profileData?.employee_id}</p>

            <div className="mt-3 flex justify-center">
              <span className="px-3 py-1 rounded-full text-xxs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {profileData?.role} • {formData.employment_type}
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-left space-y-2 text-xs text-slate-300">
              <div className="flex items-center text-slate-400">
                <Briefcase className="mr-2.5 h-4 w-4 text-blue-400 shrink-0" />
                <span className="truncate">{formData.designation || 'Software Engineer'}</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Building className="mr-2.5 h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate">{formData.department || 'Engineering'}</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Mail className="mr-2.5 h-4 w-4 text-amber-400 shrink-0" />
                <span className="truncate">{profileData?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                Contact & Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isHR}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isHR}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, City, State"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Job Details Section (Read-Only for Employee, Editable by HR) */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Organization & Job Details
                </h3>
                {!isHR && (
                  <span className="text-xxs text-slate-500 italic">Read-only (Contact HR to modify)</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Designation / Title
                  </label>
                  <input
                    type="text"
                    disabled={!isHR}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    disabled={!isHR}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    disabled={!isHR}
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    disabled={!isHR}
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2 px-3 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {saving ? (
                  'Saving Changes...'
                ) : (
                  <>
                    <Save className="mr-1.5 h-4 w-4" />
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
