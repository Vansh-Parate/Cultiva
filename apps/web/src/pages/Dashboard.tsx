import React from "react";
import Sidebar from "../components/Sidebar"; 

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full flex bg-[#e6efe6]">
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col px-10 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back, <span className="text-green-700">YourName</span>!</h1>
            <div className="text-gray-500 text-sm mt-1">Saturday, 27 Jul 2022</div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-green-100">
              🔍
            </button>
            <button className="p-2 rounded-full hover:bg-green-100">
              🔔
            </button>
          </div>
        </header>

        <section>
          <div className="h-48 bg-white rounded-2xl shadow flex items-center justify-center text-gray-400">
            Featured Plant Card (coming soon)
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-6 h-64 flex items-center justify-center text-gray-400">
            Plant Details Chart (coming soon)
          </div>
          <div className="bg-white rounded-2xl shadow p-6 h-64 flex items-center justify-center text-gray-400">
            Water Level Chart (coming soon)
          </div>
        </section>
      </main>

      <aside className="w-80 flex-shrink-0 bg-[#22313f] p-8 flex flex-col">
        <button className="bg-orange-400 hover:bg-orange-300 text-white font-bold py-3 rounded-xl shadow mb-8 transition">
          + Add New Plant
        </button>
        <div className="flex-1 text-white opacity-60 flex items-center justify-center">
          Plant List (coming soon)
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
