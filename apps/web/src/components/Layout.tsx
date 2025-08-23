import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Define auth routes where sidebar should not appear
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/google/success', '/'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {!isAuthRoute && <Sidebar />}
      <main className={`flex-1 ${!isAuthRoute ? '' : 'w-full'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;