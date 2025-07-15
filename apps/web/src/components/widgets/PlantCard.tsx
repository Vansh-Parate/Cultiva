import React from "react";
import { Plant } from "../../utils/types";
import { Droplet } from "lucide-react";

const statusColors: Record<string, string> = {
  Excellent: "bg-green-400 text-green-900",
  Good: "bg-blue-400 text-blue-900",
  Fair: "bg-yellow-300 text-yellow-900",
  Poor: "bg-orange-400 text-orange-900",
  Critical: "bg-red-500 text-red-100",
};

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => (
  <div
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer flex flex-col items-center p-6 group border border-transparent hover:border-green-300"
    onClick={onClick}
  >
    <div className="relative mb-4">
      <img
        src={plant.photoUrl || "/placeholder-plant.png"}
        alt={plant.name}
        className="w-20 h-20 rounded-xl object-cover border-2 border-green-400"
      />
      {/* Health status badge */}
      <span
        className={`absolute -bottom-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow ${statusColors[plant.healthStatus]}`}
        title={plant.healthStatus}
      >
        <Droplet size={18} />
      </span>
    </div>
    <div className="text-lg font-bold text-gray-800 text-center mb-1 truncate w-full">{plant.name}</div>
    <div className="text-xs text-green-700 text-center mb-2 truncate w-full">{plant.species}</div>
    <div className="flex items-center gap-2 mt-auto">
      <span className={`px-2 py-1 text-xs rounded-full font-semibold shadow ${statusColors[plant.healthStatus]}`}>{plant.healthStatus}</span>
      <span className="text-xs text-gray-400">•</span>
      <span className="text-xs text-gray-500">{plant.nextCare}</span>
    </div>
  </div>
);

export default PlantCard; 