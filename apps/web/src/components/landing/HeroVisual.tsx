import React from 'react';
import { Scan, Bell, Heart, MessageCircle, Share2, Sun, Droplets, ThermometerSun } from 'lucide-react';

interface HeroVisualProps {
  isDark: boolean;
}

const HeroVisual: React.FC<HeroVisualProps> = ({ isDark }) => {
  return (
    <div className="relative">
      {isDark ? (
        <>
          <div className="absolute -top-6 -left-8 h-24 w-24 rounded-full bg-emerald-800/30 blur-2xl"></div>
          <div className="absolute -bottom-8 -right-10 h-32 w-32 rounded-full bg-teal-700/30 blur-2xl"></div>
        </>
      ) : (
        <>
          <div className="absolute -top-6 -left-8 h-24 w-24 rounded-full bg-emerald-200/60 blur-2xl"></div>
          <div className="absolute -bottom-8 -right-10 h-32 w-32 rounded-full bg-lime-200/60 blur-2xl"></div>
        </>
      )}

      <div className="relative mx-auto max-w-lg">
        <div className="relative">
          {/* Main card: AI Identification */}
          <div className={`relative rounded-3xl p-4 shadow-lg ${
            isDark 
              ? 'border border-slate-800 bg-slate-900/70 shadow-emerald-900/10' 
              : 'border border-emerald-900/10 bg-white shadow-emerald-900/5'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ring-1 ${
                  isDark 
                    ? 'bg-emerald-900/30 ring-emerald-700/40' 
                    : 'bg-emerald-50 ring-emerald-900/10'
                }`}>
                  <Scan className={`h-5 w-5 ${
                    isDark ? 'text-emerald-300' : 'text-emerald-700'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm font-medium font-quicksand ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>AI Plant ID</p>
                  <p className={`text-xs font-quicksand ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Confidence 98%</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 font-quicksand ${
                isDark 
                  ? 'bg-emerald-700/20 text-emerald-200 ring-emerald-700/40' 
                  : 'bg-emerald-600/10 text-emerald-800 ring-emerald-600/20'
              }`}>Monstera deliciosa</span>
            </div>
            <div className={`mt-4 overflow-hidden rounded-2xl border ${
              isDark ? 'border-slate-800' : 'border-emerald-900/10'
            }`}>
              <img src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80" alt="Monstera plant" className="h-56 w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className={`rounded-xl border p-3 ${
                isDark 
                  ? 'border-slate-800 bg-emerald-900/30' 
                  : 'border-emerald-900/10 bg-emerald-50/70'
              }`}>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-600" />
                  <span className={`text-xs font-medium font-quicksand ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>Bright, indirect</span>
                </div>
              </div>
              <div className={`rounded-xl border p-3 ${
                isDark 
                  ? 'border-slate-800 bg-emerald-900/30' 
                  : 'border-emerald-900/10 bg-emerald-50/70'
              }`}>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-sky-600" />
                  <span className={`text-xs font-medium font-quicksand ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>Water weekly</span>
                </div>
              </div>
              <div className={`rounded-xl border p-3 ${
                isDark 
                  ? 'border-slate-800 bg-emerald-900/30' 
                  : 'border-emerald-900/10 bg-emerald-50/70'
              }`}>
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-rose-500" />
                  <span className={`text-xs font-medium font-quicksand ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>18–27°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary card: Care reminder */}
          <div className={`absolute -right-6 -bottom-8 w-56 rounded-2xl p-4 shadow-md ${
            isDark 
              ? 'border border-slate-800 bg-slate-900/70 shadow-emerald-900/10' 
              : 'border border-emerald-900/10 bg-white shadow-emerald-900/5'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className={`h-4 w-4 ${
                  isDark ? 'text-emerald-300' : 'text-emerald-700'
                }`} />
                <p className={`text-xs font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Care reminder</p>
              </div>
              <span className={`text-[10px] rounded-full px-2 py-0.5 ring-1 font-quicksand ${
                isDark 
                  ? 'bg-emerald-700/20 text-emerald-200 ring-emerald-700/40' 
                  : 'bg-emerald-600/10 text-emerald-800 ring-emerald-600/20'
              }`}>Today</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className={`h-10 w-10 overflow-hidden rounded-lg ring-1 ${
                isDark ? 'ring-slate-800' : 'ring-emerald-900/10'
              }`}>
                <img src="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80" alt="Plant thumb" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className={`text-sm font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Water your Monstera</p>
                <p className={`text-xs font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Check soil moisture first</p>
              </div>
            </div>
          </div>

          {/* Secondary card: Community post */}
          <div className={`absolute -left-6 -top-8 w-60 rounded-2xl p-4 shadow-md ${
            isDark 
              ? 'border border-slate-800 bg-slate-900/70 shadow-emerald-900/10' 
              : 'border border-emerald-900/10 bg-white shadow-emerald-900/5'
          }`}>
            <div className="flex items-center gap-2">
              <img className={`h-8 w-8 rounded-full object-cover ring-1 ${
                isDark ? 'ring-slate-800' : 'ring-emerald-900/10'
              }`} src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=256&auto=format&fit=crop" alt="User avatar" />
              <div>
                <p className={`text-xs font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Aisha</p>
                <p className={`text-[11px] font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>"New leaf unfurling!"</p>
              </div>
            </div>
            <div className={`mt-3 overflow-hidden rounded-lg ring-1 ${
              isDark ? 'ring-slate-800' : 'ring-emerald-900/10'
            }`}>
              <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" alt="Community post" className="h-24 w-full object-cover" />
            </div>
            <div className={`mt-2 flex items-center justify-between text-[11px] font-quicksand ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3.5 w-3.5 text-rose-500" /> 128
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className={`h-3.5 w-3.5 ${
                  isDark ? 'text-emerald-300' : 'text-emerald-700'
                }`} /> 18
              </span>
              <span className="inline-flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" /> Share
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;
