import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { Bell, LogOut, Clock, CheckCircle } from 'lucide-react';
=======
import { Bell, LogOut, User as UserIcon, Clock, CheckCircle } from 'lucide-react';
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout, notifications, unreadCount, markNotificationAsRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarUrl = user?.profile_pic 
    ? `http://localhost:5001/${user.profile_pic}` 
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
<<<<<<< HEAD
    <header className="fixed top-0 right-0 left-64 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-8 backdrop-blur-md shadow-xs">
      {/* Live Clock & Workspace Badge */}
      <div className="flex items-center space-x-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1.5 rounded-full bg-purple-50 px-3 py-1 border border-purple-100">
          <Clock className="h-3.5 w-3.5 text-[#714B67]" />
          <span className="font-mono text-gray-700 font-semibold">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <span className="hidden sm:inline-block text-gray-300">|</span>
        <span className="hidden sm:inline-block text-gray-600 font-medium">
=======
    <header className="fixed top-0 right-0 left-64 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-md">
      {/* Live Clock & Workspace Badge */}
      <div className="flex items-center space-x-3 text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 rounded-full bg-slate-950/60 px-3 py-1 border border-slate-800">
          <Clock className="h-3.5 w-3.5 text-blue-400" />
          <span className="font-mono text-slate-300 font-medium">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <span className="hidden sm:inline-block text-slate-600">|</span>
        <span className="hidden sm:inline-block text-slate-400 font-medium">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
          {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Action Items */}
      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
<<<<<<< HEAD
            className="relative rounded-xl p-2 text-gray-500 hover:bg-purple-50 hover:text-[#714B67] transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#714B67] text-[10px] font-bold text-white shadow-xs">
=======
            className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm shadow-blue-500/50">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
<<<<<<< HEAD
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markNotificationAsRead('all')}
                    className="text-[11px] text-[#714B67] hover:underline font-semibold"
=======
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markNotificationAsRead('all')}
                    className="text-xxs text-blue-400 hover:underline font-semibold"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {notifications.length === 0 ? (
<<<<<<< HEAD
                  <p className="text-center text-xs text-gray-400 py-6">No new notifications</p>
=======
                  <p className="text-center text-xs text-slate-500 py-6">No new notifications</p>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
<<<<<<< HEAD
                      className={`cursor-pointer rounded-xl p-2.5 text-xs transition-colors ${
                        notif.is_read ? 'bg-gray-50 text-gray-500' : 'bg-purple-50 text-gray-800 border-l-3 border-[#714B67]'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{notif.title}</p>
                      <p className="mt-0.5 text-[11px] text-gray-600 leading-relaxed">{notif.message}</p>
                      <span className="mt-1 block text-[10px] text-gray-400">
=======
                      className={`cursor-pointer rounded-lg p-2.5 text-xs transition-colors ${
                        notif.is_read ? 'bg-slate-950/40 text-slate-400' : 'bg-blue-600/10 text-slate-200 border-l-2 border-blue-500'
                      }`}
                    >
                      <p className="font-semibold text-white">{notif.title}</p>
                      <p className="mt-0.5 text-xxs leading-relaxed">{notif.message}</p>
                      <span className="mt-1 block text-xxs text-slate-500">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <Link
          to="/profile"
<<<<<<< HEAD
          className="flex items-center space-x-3 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-1.5 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
=======
          className="flex items-center space-x-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5 hover:border-slate-700 transition-all group"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
        >
          <img
            src={avatarUrl}
            alt={user?.name}
<<<<<<< HEAD
            className="h-7 w-7 rounded-full object-cover border border-gray-200 group-hover:border-[#714B67] transition-colors"
          />
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-gray-900 group-hover:text-[#714B67] transition-colors leading-tight">
              {user?.name}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
=======
            className="h-7 w-7 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-colors"
          />
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors leading-tight">
              {user?.name}
            </p>
            <p className="text-xxs text-slate-400 uppercase tracking-wider font-bold">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
              {user?.role} • {user?.employee_id}
            </p>
          </div>
        </Link>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
<<<<<<< HEAD
          className="rounded-xl p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
=======
          className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
