import React from "react";
import { Droplet, Sparkles, Sun } from "lucide-react";
import { Plant } from "../../utils/types";

const PlantStat = ({
  icon,
  value,
  label,
  bg,
  valueClass = "",
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
  valueClass?: string;
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-2xl shadow ${bg} px-8 py-6 min-w-[140px]`}
  >
    <div className="mb-3">{icon}</div>
    <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
    <div className="text-sm text-gray-500 mt-2">{label}</div>
  </div>
);

const FeaturedPlantCard: React.FC<{ plant: Plant }> = ({ plant }) => (
  <div className="relative w-full bg-white rounded-3xl shadow-2xl p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
    {/* Decorative SVG/leaf (optional) */}
    <img
      src="/decorative-leaf.svg"
      alt=""
      className="absolute top-0 right-0 w-32 opacity-10 pointer-events-none"
      style={{ zIndex: 1 }}
    />

    {/* Plant Info */}
    <div className="flex flex-col items-center md:items-start gap-4 z-10">
      <img
        src={plant.photoUrl || "/placeholder-plant.png"}
        alt={plant.name}
        className="w-24 h-24 rounded-full border-4 border-green-400 object-cover"
      />
      <div>
        <div className="text-2xl font-bold text-gray-800">{plant.name}</div>
        <div className="text-base text-green-700">{plant.species}</div>
      </div>
    </div>

    {/* Stat Widgets */}
    <div className="flex-1 flex flex-row justify-center gap-8 z-10">
      <PlantStat
        icon={<Droplet size={32} className="text-green-500" />}
        value={`${plant.humidity ?? "--"}%`}
        label="Humidity Percentage"
        bg="bg-[#1a2b23] text-white"
        valueClass="text-white"
      />
      <PlantStat
        icon={<Sparkles size={32} className="text-blue-400" />}
        value={plant.waterPH ? plant.waterPH.toString() : "--"}
        label="Daily Water pH"
        bg="bg-[#eaf6fb]"
        valueClass="text-black"
      />
      <PlantStat
        icon={<Sun size={32} className="text-yellow-400" />}
        value={plant.temperature ?? "--"}
        label="Today's Temperature"
        bg="bg-[#fff7e6]"
        valueClass="text-black"
      />
    </div>
  </div>
);

export default FeaturedPlantCard; 