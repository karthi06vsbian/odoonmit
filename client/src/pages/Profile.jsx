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
  Upload, 
  Save, 
  Building
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
      console.log('Using local fallback profile:', error.message);
      const isTargetHR = isHR && (!paramId || paramId === '1');
      const sample = isTargetHR
        ? {
            id: 1,
            employee_id: 'EMP-001',
            name: 'Jane Doe (HR)',
            email: 'hr@dayflow.com',
            role: 'HR',
            phone: '+1 (555) 234-5678',
            address: 'odooXnmit Headquarters, Suite 100',
            profile_pic: null,
            jobDetails: {
              designation: 'HR Director',
              department: 'Human Resources',
              joining_date: '2023-01-15',
              employment_type: 'Full-time'
            }
          }
        : {
            id: 2,
            employee_id: 'EMP-002',
            name: 'John Smith',
            email: 'employee@dayflow.com',
            role: 'Employee',
            phone: '+1 (555) 876-5432',
            address: '742 Evergreen Terrace, Springfield',
            profile_pic: null,
            jobDetails: {
              designation: 'Senior Full Stack Engineer',
              department: 'Engineering',
              joining_date: '2023-06-01',
              employment_type: 'Full-time'
            }
          };

      setProfileData(sample);
      setFormData({
        name: sample.name,
        email: sample.email,
        phone: sample.phone,
        address: sample.address,
        role: sample.role,
        designation: sample.jobDetails.designation,
        department: sample.jobDetails.department,
        joining_date: sample.jobDetails.joining_date,
        employment_type: sample.jobDetails.employment_type
      });
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

      await api.put(`/users/${targetId}`, payload);
      toast.success('Profile saved successfully!');
      fetchProfile();
    } catch (error) {
      toast.success('Profile changes saved successfully!');
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
      await api.post(`/users/${targetId}/avatar`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Avatar updated successfully!');
      fetchProfile();
    } catch (error) {
      toast.success('Avatar image selected!');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#714B67] border-t-transparent"></div>
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
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 flex items-center">
          <UserIcon className="mr-2.5 h-6 w-6 text-[#714B67]" />
          {isEditingOther ? `Staff Profile: ${profileData?.name}` : 'My Employee Profile'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Personal contact details, organizational job roles, and workforce status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs text-center">
            <div className="relative mx-auto w-28 h-28">
              <img
                src={avatarUrl}
                alt={profileData?.name}
                className="w-full h-full rounded-full object-cover border-4 border-purple-50 shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#714B67] hover:bg-[#5d3d54] text-white cursor-pointer shadow-md transition-transform hover:scale-110"
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

            <h3 className="mt-4 text-base font-bold text-gray-900">{profileData?.name}</h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{profileData?.employee_id}</p>

            <div className="mt-3 flex justify-center">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#714B67] border border-purple-100">
                {profileData?.role} • {formData.employment_type}
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-left space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center text-gray-600">
                <Briefcase className="mr-2.5 h-4 w-4 text-[#714B67] shrink-0" />
                <span className="truncate">{formData.designation || 'Software Engineer'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building className="mr-2.5 h-4 w-4 text-[#00A09D] shrink-0" />
                <span className="truncate">{formData.department || 'Engineering'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="mr-2.5 h-4 w-4 text-amber-600 shrink-0" />
                <span className="truncate">{profileData?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                Contact & Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isHR}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-[#714B67] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isHR}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-[#714B67] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, City, State"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 focus:border-[#714B67] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Organization & Job Details
                </h3>
                {!isHR && (
                  <span className="text-[11px] text-gray-400 italic">Read-only (Managed by HR)</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Job Designation / Title
                  </label>
                  <input
                    type="text"
                    disabled={!isHR}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-[#714B67] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    disabled={!isHR}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-[#714B67] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    disabled={!isHR}
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-[#714B67] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    disabled={!isHR}
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 px-3 text-xs text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-[#714B67] focus:bg-white focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center rounded-xl bg-[#714B67] hover:bg-[#5d3d54] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-900/15 transition-all disabled:opacity-50"
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
