import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  return (
    <button
      onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
      className={`inline-flex items-center justify-center rounded-full p-2 transition ${
        theme === 'dark'
          ? 'border border-slate-700/60 bg-slate-900/70 text-slate-300 hover:text-emerald-300'
          : 'border border-emerald-900/10 bg-white/70 text-slate-700 hover:text-emerald-700'
      }`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
};

export default ThemeToggle;
