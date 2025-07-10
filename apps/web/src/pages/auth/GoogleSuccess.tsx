import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#131316]">
      <div className="flex flex-col items-center">
        <span className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-6"></span>
        <div className="text-white text-lg font-semibold">Completing Sign in...</div>
      </div>
    </div>
  );
};

export default GoogleSuccess;