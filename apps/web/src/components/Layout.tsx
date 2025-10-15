import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Define auth routes where sidebar should not appear
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/google/success', '/'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className="bg-[#F6F9F3] text-slate-800 antialiased selection:bg-emerald-200/60 selection:text-emerald-900 min-h-screen">
      {/* Decorative Background Glows (aligned with LandingPage light theme) */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl"></div>
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-green-200/60 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-lime-200/50 blur-3xl"></div>
      </div>

      <div className="flex h-screen relative">
        {!isAuthRoute && (
          <>
            {/* Mobile toggle button */}
            <button
              className="lg:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white/80 backdrop-blur px-3 py-2 shadow-sm"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="i-lucide-menu w-5 h-5">≡</span>
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
              <div
                className="lg:hidden fixed inset-0 z-40 bg-black/40"
                onClick={() => setMobileOpen(false)}
              />
            )}

            {/* Mobile drawer */}
            <div
              className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </>
        )}
        <main className={`flex-1 transition-all duration-300 overflow-y-auto ${
          !isAuthRoute ? 'lg:pl-0' : 'w-full'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;