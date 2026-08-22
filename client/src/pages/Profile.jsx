import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Briefcase, Calendar, Upload, Save } from 'lucide-react';

export const Profile = () => {
  const { id } = useParams(); // For HR viewing other employee profiles
  const { user: currentUser, setUser: setCurrentUser } = useAuth();
  
  const targetId = id || currentUser?.id;
  const isHR = currentUser?.role === 'HR';
  const isSelf = currentUser?.id === parseInt(targetId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profile_pic: '',
    role: '',
    jobDetails: {
      designation: '',
      department: '',
      joining_date: '',
      employment_type: ''
    }
  });

  const [uploadingPic, setUploadingPic] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${targetId}`);
        setProfileData(res.data);
      } catch (error) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    if (targetId) {
      fetchProfile();
    }
  }, [targetId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobDetailsChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        [name]: value
      }
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingPic(true);
    try {
      const res = await api.post('/users/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { filePath } = res.data;
      
      // Update local state with new image path
      setProfileData((prev) => ({
        ...prev,
        profile_pic: filePath
      }));
      
      toast.success('Profile picture uploaded! Click save to apply changes.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'File upload failed');
    } finally {
      setUploadingPic(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Package update payload
      const payload = {
        phone: profileData.phone,
        address: profileData.address,
        profile_pic: profileData.profile_pic,
        ...(isHR && {
          name: profileData.name,
          email: profileData.email,
          role: profileData.role,
          designation: profileData.jobDetails?.designation,
          department: profileData.jobDetails?.department,
          joining_date: profileData.jobDetails?.joining_date,
          employment_type: profileData.jobDetails?.employment_type
        })
      };

      const res = await api.put(`/users/profile/${targetId}`, payload);
      
      // Update context if user updated their own profile
      if (isSelf) {
        setCurrentUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      setProfileData(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
      </div>
    );
  }

  // Base backend URL for assets
  const assetBase = 'http://localhost:5001/';
  const avatarUrl = profileData.profile_pic 
    ? `${assetBase}${profileData.profile_pic}` 
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="space-y-6">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">
          {isSelf ? 'My Profile' : `${profileData.name}'s Profile`}
        </h2>
        <p className="text-xs text-slate-400">View and update contact records and business details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center text-center shadow-lg h-fit">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-28 w-28 rounded-full object-cover border-4 border-slate-800 shadow-md group-hover:opacity-75 transition-opacity"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-500 rounded-full cursor-pointer shadow-md transition-colors text-white">
              <Upload className="h-4 w-4" />
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" disabled={uploadingPic} />
            </label>
          </div>
          
          <h3 className="mt-4 text-base font-bold text-white">{profileData.name}</h3>
          <span className="mt-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
            {profileData.role === 'HR' ? 'HR Manager' : 'Staff Employee'}
          </span>
          <p className="mt-2 text-xxs text-slate-500 font-medium">Employee ID: {profileData.employee_id}</p>

          <div className="mt-6 w-full border-t border-slate-800/60 pt-4 text-left space-y-3">
            <div className="flex items-center text-xs text-slate-400">
              <Briefcase className="mr-2.5 h-4 w-4 text-slate-500 shrink-0" />
              <span>{profileData.jobDetails?.designation || 'No title set'}</span>
            </div>
            <div className="flex items-center text-xs text-slate-400">
              <User className="mr-2.5 h-4 w-4 text-slate-500 shrink-0" />
              <span>{profileData.jobDetails?.department || 'No department set'}</span>
            </div>
            <div className="flex items-center text-xs text-slate-400">
              <Calendar className="mr-2.5 h-4 w-4 text-slate-500 shrink-0" />
              <span>Joined: {profileData.jobDetails?.joining_date || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Editable details form */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <form onSubmit={handleProfileSave} className="space-y-6">
            
            {/* Personal Details Section */}
            <div>
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:text-slate-500 disabled:bg-slate-950/20"
                    disabled={!isHR}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:text-slate-500 disabled:bg-slate-950/20"
                    disabled={!isHR}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="phone"
                      value={profileData.phone || ''}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {isHR && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">User Role</label>
                    <select
                      name="role"
                      value={profileData.role}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Employee" className="bg-slate-900">Employee</option>
                      <option value="HR" className="bg-slate-900">HR / Admin</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address || ''}
                    onChange={handleInputChange}
                    placeholder="123 Street Address, City, Country"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-800/60" />

            {/* Employment Details Section */}
            <div>
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Job Title / Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={profileData.jobDetails?.designation || ''}
                    onChange={handleJobDetailsChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:text-slate-500 disabled:bg-slate-950/20"
                    disabled={!isHR}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={profileData.jobDetails?.department || ''}
                    onChange={handleJobDetailsChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:text-slate-500 disabled:bg-slate-950/20"
                    disabled={!isHR}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Joining Date</label>
                  <input
                    type="date"
                    name="joining_date"
                    value={profileData.jobDetails?.joining_date || ''}
                    onChange={handleJobDetailsChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:text-slate-500 disabled:bg-slate-950/20"
                    disabled={!isHR}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Employment Type</label>
                  <select
                    name="employment_type"
                    value={profileData.jobDetails?.employment_type || ''}
                    onChange={handleJobDetailsChange}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:text-slate-500 disabled:bg-slate-950/20"
                    disabled={!isHR}
                  >
                    <option value="Full-time" className="bg-slate-900">Full-time</option>
                    <option value="Part-time" className="bg-slate-900">Part-time</option>
                    <option value="Contract" className="bg-slate-900">Contract</option>
                    <option value="Internship" className="bg-slate-900">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-slate-800/60" />

            {/* Salary Structure Section */}
            <div>
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Salary Structure</h3>
              {profileData.payroll && profileData.payroll.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/20 p-4 rounded-xl border border-slate-850">
                  <div>
                    <span className="block text-xxs text-slate-550 font-bold uppercase tracking-wider mb-1">Basic Salary</span>
                    <span className="text-sm font-semibold text-slate-200">${parseFloat(profileData.payroll[0].basic_salary).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-xxs text-slate-550 font-bold uppercase tracking-wider mb-1">Allowances</span>
                    <span className="text-sm font-semibold text-emerald-400">+${parseFloat(profileData.payroll[0].allowances).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-xxs text-slate-550 font-bold uppercase tracking-wider mb-1">Deductions</span>
                    <span className="text-sm font-semibold text-rose-400">-${parseFloat(profileData.payroll[0].deductions).toFixed(2)}</span>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-slate-850 md:pl-4 pt-3 md:pt-0">
                    <span className="block text-xxs text-slate-550 font-bold uppercase tracking-wider mb-1">Net Salary</span>
                    <span className="text-base font-black text-white">${parseFloat(profileData.payroll[0].net_salary).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-950/20 rounded-xl border border-slate-850 text-slate-500 text-xs italic">
                  No salary details structured for this employee yet.
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50"
              >
                {saving ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
