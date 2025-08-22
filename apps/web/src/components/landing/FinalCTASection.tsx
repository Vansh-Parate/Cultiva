import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail, Sparkles } from 'lucide-react';
import Logo from '../Logo';

interface FinalCTASectionProps {
  isDark: boolean;
}

const FinalCTASection: React.FC<FinalCTASectionProps> = ({ isDark }) => {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className={`relative overflow-hidden rounded-3xl border p-8 sm:p-12 ${
          isDark 
            ? 'border-slate-800 bg-gradient-to-br from-emerald-950 to-slate-950' 
            : 'border-emerald-900/10 bg-gradient-to-br from-emerald-50 to-lime-50'
        }`}>
          {isDark ? (
            <>
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-800/30 blur-2xl"></div>
              <div className="absolute -left-8 -bottom-10 h-40 w-40 rounded-full bg-teal-800/30 blur-2xl"></div>
            </>
          ) : (
            <>
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl"></div>
              <div className="absolute -left-8 -bottom-10 h-40 w-40 rounded-full bg-lime-200/40 blur-2xl"></div>
            </>
          )}
          
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
                             <h3 className={`text-2xl sm:text-3xl tracking-tight font-quicksand font-medium ${
                 isDark ? 'text-emerald-50' : 'text-emerald-950'
               }`}>
                 Join Cultiva today
               </h3>
              <p className={`mt-2 text-sm font-quicksand ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Build your living collection, learn with seasonal guidance, and grow with a community that cares.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/auth/signup" className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md font-quicksand ${
                  isDark 
                    ? 'bg-emerald-600 ring-emerald-500/30 hover:bg-emerald-500' 
                    : 'bg-emerald-700 ring-emerald-900/20 hover:bg-emerald-800'
                }`}>
                  <Download className="h-5 w-5" />
                  Download the app
                </Link>
                <a href="#" className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md font-quicksand ${
                  isDark 
                    ? 'border border-slate-700/60 bg-slate-900 text-slate-100 hover:border-slate-600' 
                    : 'border border-emerald-900/10 bg-white text-slate-800 hover:border-emerald-900/20'
                }`}>
                  <Mail className="h-5 w-5" />
                  Sign up with email
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="mx-auto max-w-md">
                <div className={`overflow-hidden rounded-2xl border shadow-sm ${
                  isDark 
                    ? 'border-slate-800 bg-slate-900/60' 
                    : 'border-emerald-900/10 bg-white'
                }`}>
                  <div className="h-56 w-full">
                    <img src="https://images.unsplash.com/photo-1658535824284-713035fb8629?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGdyZWVuaG91c2V8ZW58MHwwfDB8fHww" alt="Green nook" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className={`h-4 w-4 ${
                          isDark ? 'text-emerald-300' : 'text-emerald-700'
                        }`} />
                        <p className={`text-sm font-medium font-quicksand ${
                          isDark ? 'text-emerald-100' : 'text-emerald-900'
                        }`}>Your digital greenhouse</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-medium ring-1 font-quicksand ${
                        isDark 
                          ? 'bg-emerald-700/20 text-emerald-200 ring-emerald-700/40' 
                          : 'bg-emerald-600/10 text-emerald-800 ring-emerald-600/20'
                      }`}>Free to start</span>
                    </div>
                    <p className={`mt-2 text-xs font-quicksand ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Keep everything in one calm, beautiful place.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border px-6 py-6 sm:flex-row ${
          isDark 
            ? 'border-slate-800 bg-slate-900/60' 
            : 'border-emerald-900/10 bg-white/60'
        }`}>
                     <div className="flex items-center gap-3">
             <Logo size="md" showText={false} isDark={isDark} />
             <p className={`text-sm font-quicksand ${
               isDark ? 'text-slate-400' : 'text-slate-600'
             }`}>© 2025 Cultiva</p>
           </div>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className={`text-sm transition font-quicksand ${
                  isDark 
                    ? 'text-slate-300 hover:text-emerald-300' 
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                {item}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
};

export default FinalCTASection;
