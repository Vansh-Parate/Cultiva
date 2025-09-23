import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const location = useLocation();
  
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

      <div className="flex min-h-screen relative">
        {!isAuthRoute && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${
          !isAuthRoute ? 'lg:pl-0' : 'w-full'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;