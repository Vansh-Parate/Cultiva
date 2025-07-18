import React from "react";
import { Droplet } from "lucide-react";

const statusColors: Record<string, string> = {
  Excellent: "bg-green-400 text-green-900",
  Good: "bg-blue-400 text-blue-900",
  Fair: "bg-yellow-300 text-yellow-900",
  Poor: "bg-orange-400 text-orange-900",
  Critical: "bg-red-500 text-red-100",
};

const RightSidebar = ({ plants, selectedPlantId, onSelectPlant }) => (
  <aside className="w-80 shrink-0 bg-[#22313f] p-8 flex flex-col">
    <button className="bg-orange-400 hover:bg-orange-300 text-white font-bold py-3 rounded-xl shadow-sm mb-8 transition">
      + Add New Plant
    </button>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white font-semibold text-lg">Plant List</span>
        <button className="text-xs text-orange-200 hover:underline">see all</button>
      </div>
      <ul className="space-y-4">
        {plants.map(plant => {
          const isSelected = plant.id === selectedPlantId;
          return (
            <li
              key={plant.id}
              className={`flex items-center gap-4 rounded-xl p-3 cursor-pointer transition
                ${isSelected ? "bg-white/20 shadow-lg" : "bg-white/5 hover:bg-white/10"}
              `}
              onClick={() => onSelectPlant(plant.id)}
            >
              {/* Avatar with water status badge */}
              <div className="relative">
                <img
                  src={plant.photoUrl}
                  alt={plant.name}
                  className="w-10 h-10 rounded-full border-2 border-green-400 object-cover"
                />
                {/* Water status badge (bottom right) */}
                <span className={`absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-sm ${statusColors[plant.healthStatus]}`}>
                  <Droplet size={14} />
                </span>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{plant.name}</div>
                <div className="text-xs text-green-200">{plant.species}</div>
              </div>
              {/* Water status pill */}
              <span className={`px-2 py-1 text-xs rounded-full font-semibold shadow-sm ${statusColors[plant.healthStatus]}`}>
                {plant.healthStatus}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  </aside>
);

export default RightSidebar;
