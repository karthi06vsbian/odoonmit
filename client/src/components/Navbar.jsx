import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User as UserIcon, Clock, CheckCircle } from 'lucide-react';
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
          {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Action Items */}
      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm shadow-blue-500/50">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markNotificationAsRead('all')}
                    className="text-xxs text-blue-400 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`cursor-pointer rounded-lg p-2.5 text-xs transition-colors ${
                        notif.is_read ? 'bg-slate-950/40 text-slate-400' : 'bg-blue-600/10 text-slate-200 border-l-2 border-blue-500'
                      }`}
                    >
                      <p className="font-semibold text-white">{notif.title}</p>
                      <p className="mt-0.5 text-xxs leading-relaxed">{notif.message}</p>
                      <span className="mt-1 block text-xxs text-slate-500">
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
          className="flex items-center space-x-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5 hover:border-slate-700 transition-all group"
        >
          <img
            src={avatarUrl}
            alt={user?.name}
            className="h-7 w-7 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-colors"
          />
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors leading-tight">
              {user?.name}
            </p>
            <p className="text-xxs text-slate-400 uppercase tracking-wider font-bold">
              {user?.role} • {user?.employee_id}
            </p>
          </div>
        </Link>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
