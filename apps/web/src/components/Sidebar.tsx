import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  CalendarCheck2, 
  ScanLine, 
  Users, 
  Bell, 
  Plus,
  Camera,
  LogOut
} from 'lucide-react';

type SidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onNavigate }) => {
  const location = useLocation();
  const [notifications] = useState(3);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/plants', icon: Leaf, label: 'My Plants' },
    { path: '/care', icon: CalendarCheck2, label: 'Care' },
    { path: '/find-plant', icon: ScanLine, label: 'Identify' },
    { path: '/community', icon: Users, label: 'Community' },
  ];


  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`${mobile ? 'flex h-full' : 'hidden lg:flex h-screen'} w-72 flex-col border-r border-slate-800 bg-slate-900/70 backdrop-blur overflow-hidden`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 h-16 flex-shrink-0">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-sm">
          <img src="./public/Cultiva-Photoroom.png" alt="Cultiva Logo" className="text-sm font-semibold tracking-tight"></img>
        </div>
        <div>
          <p className="text-xl tracking-tight font-semibold text-teal-100">Cultiva</p>
          <p className="text-xs text-slate-400">Your plant companion</p>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Primary Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  isActive(item.path)
                    ? 'text-teal-100 bg-teal-900/30 ring-1 ring-teal-700/40'
                    : 'hover:bg-teal-900/20 hover:text-teal-100 text-slate-300'
                }`}
              >
                {isActive(item.path) && (
                  <span className="absolute left-0 top-0 h-full w-1.5 rounded-r-xl bg-teal-400"></span>
                )}
                <Icon className={`w-5 h-5 ${
                  isActive(item.path) 
                    ? 'text-teal-300' 
                    : 'text-slate-400 group-hover:text-teal-300'
                }`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Quick Actions */}
          <div className="mt-4 h-px w-full bg-slate-800"></div>
          <div className="mt-3 px-3 grid grid-cols-2 gap-2">
            <Link
              to="/plants?action=add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-teal-500/30 transition hover:bg-teal-500"
            >
              <Plus className="h-4 w-4" />
              Add plant
            </Link>
            <Link
              to="/find-plant"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 hover:border-slate-600 transition"
            >
              <Camera className="h-4 w-4" />
              Identify
            </Link>
          </div>

          {/* Profile Section */}
          <div className="mt-4 h-px w-full bg-slate-800"></div>
          <div className="mt-3 px-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2">
                <img className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-800" src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=80&auto=format&fit=crop" alt="User" />
                <div>
                  <p className="text-xs font-medium text-teal-100">Alex Rivera</p>
                  <p className="text-[11px] text-slate-400">Pro · 64 plants</p>
                </div>
              </div>
              <button className="inline-flex items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900 p-2 text-slate-300 hover:text-teal-300">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="mt-4 px-3 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">Notifications</span>
              <span className="inline-flex items-center gap-1 text-xs text-teal-300 bg-teal-900/30 px-2 py-0.5 rounded-full">
                <Bell className="w-3.5 h-3.5" /> {notifications}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


