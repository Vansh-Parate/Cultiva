import React, { useState } from 'react';
import { Search, Plus, Leaf } from 'lucide-react';

interface TopNavigationProps {
  onAddPlant?: () => void;
  onSearch?: (query: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onAddPlant, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200">
            <Leaf className="h-5 w-5" />
          </span>
          <div className="hidden sm:block">
            <h1 className="text-2xl tracking-tight font-semibold text-slate-900">My Plants</h1>
            <p className="text-sm text-slate-500">Manage your collection and keep them thriving</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search plants…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-72 rounded-xl border border-slate-200 bg-white/70 pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={onAddPlant}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-sm font-medium shadow-sm hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Plant
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
