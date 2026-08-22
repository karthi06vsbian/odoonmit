import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarCheck, 
  DollarSign, 
  User as UserIcon,
<<<<<<< HEAD
  Sparkles
=======
  ShieldCheck
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
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
<<<<<<< HEAD
    <aside className="fixed top-0 bottom-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white p-5 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 pb-5 border-b border-gray-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#714B67] shadow-md shadow-purple-900/10 text-white font-black text-xl tracking-tight">
          o
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-gray-900 flex items-center">
            odoo<span className="text-[#714B67]">Xnmit</span>
          </h1>
          <p className="text-[11px] text-gray-500 font-medium">Enterprise HRMS</p>
        </div>
      </div>

      {/* Role Badge Banner */}
      <div className="mt-4 px-3 py-2 rounded-xl bg-purple-50/70 border border-purple-100/80 flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Access</span>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
          isHR ? 'bg-[#714B67] text-white' : 'bg-emerald-600 text-white'
=======
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
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
        }`}>
          {isHR ? 'HR Officer' : 'Employee'}
        </span>
      </div>

      {/* Navigation Links */}
<<<<<<< HEAD
      <nav className="mt-5 flex-1 space-y-1.5">
=======
      <nav className="mt-6 flex-1 space-y-1.5">
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
<<<<<<< HEAD
                `flex items-center space-x-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#714B67] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-purple-50/80 hover:text-[#714B67]'
=======
                `flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

<<<<<<< HEAD
      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center space-x-1 text-[11px] font-semibold text-purple-900/60">
          <Sparkles className="h-3.5 w-3.5 text-[#714B67]" />
          <span>odooXnmit Edition</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">Every workday, aligned</p>
=======
      {/* System Footer info */}
      <div className="pt-4 border-t border-slate-800 text-xxs text-slate-500 text-center font-mono">
        <p>Dayflow v2.4 • Odoo Spec</p>
>>>>>>> 7b30cc86e73e78e1af2bdfe633af9c41bf0273cf
      </div>
    </aside>
  );
};

export default Sidebar;
