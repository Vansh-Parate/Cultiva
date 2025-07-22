import React, { useEffect, useState } from "react";
import { Droplet, Sparkles, Sun } from "lucide-react";
import { Plant } from "../../utils/types";
import { useWeather } from '~/hooks/useWeather';
import { getWaterPHFromGemini } from '~/lib/gemini';

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
    className={`flex flex-col items-center justify-center rounded-2xl shadow-sm ${bg} px-8 py-6 min-w-[140px]`}
  >
    <div className="mb-3">{icon}</div>
    <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
    <div className="text-sm text-gray-500 mt-2">{label}</div>
  </div>
);

const FeaturedPlantCard: React.FC<{ plant: Plant }> = ({ plant }) => {
  // Use weather hook: prefer plant.location, fallback to user's location
  const { weather, loading } = useWeather(plant.location);
  const [phAdvice, setPhAdvice] = useState<string | null>(null);

  useEffect(() => {
    if (!plant.waterPH && plant.species) {
      getWaterPHFromGemini(plant.species, plant.location).then(setPhAdvice);
    }
  }, [plant.waterPH, plant.species, plant.location]);

  return (
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
          onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
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
          value={
            loading
              ? 'Loading...'
              : (weather.humidity ?? plant.humidity ?? '--') + '%'
          }
          label="Humidity Percentage"
          bg="bg-[#1a2b23] text-white"
          valueClass="text-white"
        />
        <PlantStat
          icon={<Sparkles size={32} className="text-blue-400" />}
          value={
            plant.waterPH !== undefined && plant.waterPH !== null && plant.waterPH !== 0
              ? plant.waterPH.toString()
              : phAdvice || '--'
          }
          label="Daily Water pH"
          bg="bg-[#eaf6fb]"
          valueClass="text-black"
        />
        <PlantStat
          icon={<Sun size={32} className="text-yellow-400" />}
          value={
            loading
              ? 'Loading...'
              : (
                  weather.temperature !== undefined
                    ? `${weather.temperature.toFixed(1)}°C`
                    : plant.temperature !== undefined && plant.temperature !== null
                      ? `${Number(plant.temperature).toFixed(1)}°C`
                      : '--'
                )
          }
          label="Today's Temperature"
          bg="bg-[#fff7e6]"
          valueClass="text-black"
        />
      </div>
    </div>
  );
};

export default FeaturedPlantCard; 