import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, Clock, CheckCircle } from 'lucide-react';
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
          {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Action Items */}
      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-gray-500 hover:bg-purple-50 hover:text-[#714B67] transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#714B67] text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markNotificationAsRead('all')}
                    className="text-[11px] text-[#714B67] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-6">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`cursor-pointer rounded-xl p-2.5 text-xs transition-colors ${
                        notif.is_read ? 'bg-gray-50 text-gray-500' : 'bg-purple-50 text-gray-800 border-l-3 border-[#714B67]'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{notif.title}</p>
                      <p className="mt-0.5 text-[11px] text-gray-600 leading-relaxed">{notif.message}</p>
                      <span className="mt-1 block text-[10px] text-gray-400">
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
          className="flex items-center space-x-3 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-1.5 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
        >
          <img
            src={avatarUrl}
            alt={user?.name}
            className="h-7 w-7 rounded-full object-cover border border-gray-200 group-hover:border-[#714B67] transition-colors"
          />
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-gray-900 group-hover:text-[#714B67] transition-colors leading-tight">
              {user?.name}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              {user?.role} • {user?.employee_id}
            </p>
          </div>
        </Link>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="rounded-xl p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
