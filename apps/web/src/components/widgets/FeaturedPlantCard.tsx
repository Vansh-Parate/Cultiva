import React, { useEffect, useState } from "react";
import { Droplet, Sparkles, Sun } from "lucide-react";
import { Plant } from "~/utils/types";
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
    className={`flex flex-col items-center justify-center rounded-2xl shadow-sm ${bg} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 flex-1 min-w-0`}
  >
    <div className="mb-2 sm:mb-3">{icon}</div>
    <div className={`text-base sm:text-lg lg:text-xl font-bold ${valueClass} text-center`}>{value}</div>
    <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center leading-tight">{label}</div>
  </div>
);

interface FeaturedPlantCardProps {
  plant: Plant;
}

const FeaturedPlantCard: React.FC<FeaturedPlantCardProps> = ({ plant }) => {
  const { weather, loading } = useWeather(plant.location);
  const [phAdvice, setPhAdvice] = useState<string | null>(null);

  useEffect(() => {
    if (!plant.waterPH && plant.species) {
      getWaterPHFromGemini(plant.species, plant.location).then(setPhAdvice);
    }
  }, [plant.waterPH, plant.species, plant.location]);

  return (
    <div className="relative w-full bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 overflow-hidden">
      <img
        src="/decorative-leaf.svg"
        alt=""
        className="absolute top-0 right-0 w-20 sm:w-24 lg:w-32 opacity-10 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div className="flex flex-col items-center lg:items-start gap-3 sm:gap-4 z-10 flex-shrink-0">
        <img
          src={plant.photoUrl || "/placeholder-plant.png"}
          alt={plant.name}
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-green-400 object-cover"
          onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
        />
        <div className="text-center lg:text-left">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{plant.name}</div>
          <div className="text-sm sm:text-base text-green-700">{plant.species}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 z-10 min-w-0 w-full">
        <PlantStat
          icon={<Droplet size={24} className="text-green-500 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
          value={
            loading
              ? 'Loading...'
              : (weather.humidity ?? plant.humidity ?? 'N/A') + '%'
          }
          label="Humidity"
          bg="bg-[#1a2b23] text-white"
          valueClass="text-white"
        />
        <PlantStat
          icon={<Sparkles size={24} className="text-blue-400 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
          value={
            loading
              ? 'Loading...'
              : plant.waterPH !== undefined && plant.waterPH !== null && plant.waterPH !== 0
                ? plant.waterPH.toString()
                : phAdvice && phAdvice !== 'No answer found'
                  ? phAdvice
                  : 'N/A'
          }
          label="Water pH"
          bg="bg-[#eaf6fb]"
          valueClass="text-black"
        />
        <PlantStat
          icon={<Sun size={24} className="text-yellow-400 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
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
          label="Temperature"
          bg="bg-[#fff7e6]"
          valueClass="text-black"
        />
      </div>

    </div>
  );
};

export default FeaturedPlantCard; 