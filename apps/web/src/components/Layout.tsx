import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Define auth routes where sidebar should not appear
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/google/success', '/'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className="bg-slate-950 text-slate-100 antialiased selection:bg-teal-400/30 selection:text-teal-50 min-h-screen">
      {/* Decorative Background Glows */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-800/25 blur-3xl"></div>
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-cyan-700/20 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-teal-700/20 blur-3xl"></div>
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