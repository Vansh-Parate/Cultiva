import React from "react";
import { Droplet, Thermometer, Sparkles } from "lucide-react";
import { FeaturedPlant } from "./types";

const statPills = [
  {
    icon: <Droplet size={18} className="text-green-500" />,
    label: "Humidity",
    value: (plant: FeaturedPlant) => `${plant.humidity}%`,
  },
  {
    icon: <Sparkles size={18} className="text-blue-400" />,
    label: "Water pH",
    value: (plant: FeaturedPlant) => plant.waterPH,
  },
  {
    icon: <Thermometer size={18} className="text-yellow-500" />,
    label: "Temp",
    value: (plant: FeaturedPlant) => plant.temperature,
  },
];

const FeaturedPlantCard: React.FC<{ plant: FeaturedPlant }> = ({ plant }) => (
  <div className="relative bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
    {/* Plant Image */}
    <div className="flex-shrink-0">
      <img
        src={plant.photoUrl || '/placeholder-plant.png'}
        alt={plant.name}
        className="w-32 h-32 rounded-full border-4 border-green-400 shadow-lg object-cover"
      />
    </div>
    {/* Plant Info and Stats */}
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{plant.name}</div>
        <div className="text-green-700 dark:text-green-200 text-sm italic">{plant.species}</div>
      </div>
      <div className="flex gap-4 mt-2">
        {statPills.map((pill, i) => (
          <div
            key={pill.label}
            className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/60 rounded-xl px-4 py-2 shadow text-sm font-medium"
          >
            {pill.icon}
            <span>{pill.value(plant)}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-4">
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-full shadow transition">
          <Droplet size={18} /> Water
        </button>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-full shadow transition">
          <Sparkles size={18} /> Fertilize
        </button>
      </div>
    </div>
  </div>
);

export default FeaturedPlantCard;