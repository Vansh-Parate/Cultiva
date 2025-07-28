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
    className={`flex flex-col items-center justify-center rounded-2xl shadow-sm ${bg} px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-w-[120px] sm:min-w-[140px]`}
  >
    <div className="mb-2 sm:mb-3">{icon}</div>
    <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${valueClass}`}>{value}</div>
    <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">{label}</div>
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
    <div className="relative w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:gap-12 overflow-hidden">
      <img
        src="/decorative-leaf.svg"
        alt=""
        className="absolute top-0 right-0 w-24 sm:w-32 opacity-10 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div className="flex flex-col items-center md:items-start gap-3 sm:gap-4 z-10">
        <img
          src={plant.photoUrl || "/placeholder-plant.png"}
          alt={plant.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-green-400 object-cover"
          onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
        />
        <div className="text-center md:text-left">
          <div className="text-xl sm:text-2xl font-bold text-gray-800">{plant.name}</div>
          <div className="text-sm sm:text-base text-green-700">{plant.species}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-row justify-center gap-4 sm:gap-6 lg:gap-8 z-10">
        <PlantStat
          icon={<Droplet size={32} className="text-green-500" />}
          value={
            loading
              ? 'Loading...'
              : (weather.humidity ?? plant.humidity ?? 'N/A') + '%'
          }
          label="Humidity Percentage"
          bg="bg-[#1a2b23] text-white"
          valueClass="text-white"
        />
        <PlantStat
          icon={<Sparkles size={32} className="text-blue-400" />}
          value={
            loading
              ? 'Loading...'
              : plant.waterPH !== undefined && plant.waterPH !== null && plant.waterPH !== 0
                ? plant.waterPH.toString()
                : phAdvice && phAdvice !== 'No answer found'
                  ? phAdvice
                  : 'N/A'
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