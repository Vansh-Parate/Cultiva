import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  Leaf, 
  CalendarCheck2, 
  ScanLine, 
  Users, 
  Bell, 
  Settings 
} from 'lucide-react';

const Sidebar: React.FC = () => {
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
    <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="flex items-center gap-3 px-6 h-16">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-sm">
          <Sprout className="text-white w-5 h-5" />
        </div>
        <div>
          <p className="text-xl tracking-tight font-semibold text-slate-900">Cultiva</p>
          <p className="text-xs text-slate-500">Your plant companion</p>
        </div>
      </div>
      
      <nav className="mt-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                isActive(item.path)
                  ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              {isActive(item.path) && (
                <span className="absolute left-0 top-0 h-full w-1.5 rounded-r-xl bg-emerald-500"></span>
              )}
              <Icon className={`w-5 h-5 ${
                isActive(item.path) 
                  ? 'text-emerald-700' 
                  : 'text-slate-500 group-hover:text-slate-700'
              }`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500">Notifications</span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <Bell className="w-3.5 h-3.5" /> {notifications}
          </span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=300&auto=format&fit=crop" 
            alt="Profile avatar" 
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Aisha</p>
            <p className="text-xs text-slate-500 truncate">Grow mode: On</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-100" aria-label="Settings">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


