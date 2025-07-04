import React, { useState } from "react";
import { FaLeaf, FaSun, FaMoon, FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? "bg-[#18181b] min-h-screen flex" : "bg-white min-h-screen flex"}>
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      
    </div>
  );
};

export default Dashboard;
