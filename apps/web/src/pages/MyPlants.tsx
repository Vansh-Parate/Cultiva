import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import FeaturedPlantCard from "../components/widgets/FeaturedPlantCard";
import { demoFeaturedPlants } from "../utils/demoPlant";

const MyPlants = () => {
  const [selectedPlantId, setSelectedPlantId] = useState(demoFeaturedPlants[0].id);
  const selectedPlant = demoFeaturedPlants.find(p => p.id === selectedPlantId);

  return (
    <div className="min-h-screen w-full flex bg-[#e6efe6]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-10 py-8 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back, <span className="text-green-700">YourName</span>!</h1>
            <div className="text-gray-500 text-sm mt-1">Saturday, 27 Jul 2022</div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-green-100">🔍</button>
            <button className="p-2 rounded-full hover:bg-green-100">🔔</button>
          </div>
        </header>

        {/* Featured Plant Card */}
        <section className="w-full flex justify-center">
          {selectedPlant && <FeaturedPlantCard plant={selectedPlant} />}
        </section>

        {/* Charts and Widgets (placeholders) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-6 h-64 flex items-center justify-center text-gray-400">
            Plant Details Chart (coming soon)
          </div>
          <div className="bg-white rounded-2xl shadow p-6 h-64 flex items-center justify-center text-gray-400">
            Water Level Chart (coming soon)
          </div>
        </section>
      </main>

      {/* Right Sidebar */}
      <RightSidebar
        plants={demoFeaturedPlants}
        selectedPlantId={selectedPlantId}
        onSelectPlant={setSelectedPlantId}
      />
    </div>
  );
};

export default MyPlants;


