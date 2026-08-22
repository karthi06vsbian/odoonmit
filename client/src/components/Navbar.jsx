import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, Clock, User, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { 
    user, 
    logout, 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="fixed top-0 right-0 left-64 z-10 flex h-16 items-center justify-between bg-slate-900 border-b border-slate-800 px-8 text-white">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-md font-semibold text-white">
          {getGreeting()}, <span className="text-blue-400">{user?.name}</span>
        </h1>
        <p className="text-xxs text-slate-400">Every workday, perfectly aligned.</p>
      </div>

      {/* Action panel */}
      <div className="flex items-center space-x-6">
        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xxs font-bold text-white ring-2 ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div className="absolute right-0 mt-3.5 w-80 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden z-30">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-900">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && markNotificationRead(n.id)}
                      className={`p-3.5 cursor-pointer transition-colors text-xs ${
                        n.is_read ? 'bg-slate-950 hover:bg-slate-900/50' : 'bg-blue-600/5 hover:bg-blue-600/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`font-semibold capitalize text-xxs px-1.5 py-0.5 rounded ${
                          n.type.includes('Leave') ? 'bg-amber-500/10 text-amber-400' :
                          n.type.includes('Payroll') ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {n.type}
                        </span>
                        {!n.is_read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1"></span>}
                      </div>
                      <p className="mt-1.5 text-slate-300 leading-relaxed font-normal">{n.message}</p>
                      <div className="mt-2 flex items-center text-xxs text-slate-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDate(n.created_at || n.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            {user?.name?.slice(0, 1)}
          </div>
          <div className="text-left hidden md:block">
            <span className="block text-xs font-semibold text-white leading-tight">{user?.name}</span>
            <span className="block text-xxs text-slate-400 leading-none capitalize">{user?.role === 'HR' ? 'HR / Admin' : 'Employee'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
