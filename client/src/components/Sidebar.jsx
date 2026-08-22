import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarCheck, 
  DollarSign, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isHR } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Leave & Time-Off', path: '/leaves', icon: CalendarCheck },
    { name: 'Payroll & Slips', path: '/payroll', icon: DollarSign },
    { name: 'My Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <aside className="fixed top-0 bottom-0 left-0 z-30 flex w-64 flex-col border-r border-slate-800 bg-slate-900/95 p-5 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20 text-white font-black text-lg">
          D
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center">
            Dayflow <span className="ml-1.5 text-xxs font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">HRMS</span>
          </h1>
          <p className="text-xxs text-slate-500 font-medium">Workforce, Aligned</p>
        </div>
      </div>

      {/* Role Banner */}
      <div className="mt-4 px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-855 flex items-center justify-between">
        <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Access Mode</span>
        <span className={`text-xxs font-bold px-2 py-0.5 rounded-full ${
          isHR ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {isHR ? 'HR Officer' : 'Employee'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* System Footer info */}
      <div className="pt-4 border-t border-slate-800 text-xxs text-slate-500 text-center font-mono">
        <p>Dayflow v2.4 • Odoo Spec</p>
      </div>
    </aside>
  );
};

export default Sidebar;
