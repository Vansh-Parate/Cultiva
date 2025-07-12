import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen w-full bg-[#0f0f0f] relative text-white">
    {/* Diagonal Grid with Green Glow */}
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(0, 255, 128, 0.15) 0, rgba(0, 255, 128, 0.15) 1px, transparent 1px, transparent 20px),
          repeating-linear-gradient(-45deg, rgba(0, 255, 128, 0.15) 0, rgba(0, 255, 128, 0.15) 1px, transparent 1px, transparent 20px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export default Layout;