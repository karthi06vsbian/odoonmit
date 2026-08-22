import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  CalendarDays, 
  CalendarClock, 
  CreditCard, 
  LogOut 
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: UserCircle },
    { name: 'Attendance', path: '/attendance', icon: CalendarDays },
    { name: 'Leave & Time-Off', path: '/leaves', icon: CalendarClock },
    { name: 'Payroll & Slips', path: '/payroll', icon: CreditCard },
  ];

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-20 flex w-64 flex-col bg-slate-950 text-slate-300 border-r border-slate-800">
      {/* Branding */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20">
            D
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-wider">Dayflow</span>
            <span className="block text-xxs text-slate-500 uppercase tracking-widest font-semibold">HR Portal</span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 pl-3'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile Info */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/50">
        <div className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-semibold uppercase">
              {user?.name?.slice(0, 2) || 'US'}
            </div>
            <div className="truncate">
              <span className="block text-xs font-semibold text-white truncate">{user?.name}</span>
              <span className="block text-xxs text-slate-400 font-medium capitalize">{user?.role === 'HR' ? 'HR / Admin' : 'Employee'}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
