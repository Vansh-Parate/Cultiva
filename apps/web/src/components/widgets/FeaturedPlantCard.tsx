import React, { useEffect, useState } from "react";
import { Droplet, Sparkles, Sun } from "lucide-react";
import { Plant } from "~/utils/types";
import { useWeather } from '~/hooks/useWeather';
import { getWaterPHFromGemini } from '~/lib/gemini';
import { useAuthContext } from '../../contexts/AuthContext';

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
  const { user } = useAuthContext();
  // Use plant location, fallback to user location, or null (will use geolocation)
  const location = plant.location || user?.location || null;
  const { weather, loading } = useWeather(location);
  const [phAdvice, setPhAdvice] = useState<string | null>(null);
  const [phLoading, setPhLoading] = useState(false);

  useEffect(() => {
    // Fetch pH from Gemini if not available in database
    if ((!plant.waterPH || plant.waterPH === 0) && plant.species) {
      setPhLoading(true);
      getWaterPHFromGemini(plant.species, location || undefined)
        .then(setPhAdvice)
        .catch(err => {
          console.error('Failed to get pH from Gemini:', err);
          setPhAdvice(null);
        })
        .finally(() => setPhLoading(false));
    }
  }, [plant.waterPH, plant.species, location]);

  const getHumidityValue = () => {
    if (loading) return 'Loading...';
    // Prioritize real-time weather data over database values
    if (weather.humidity !== undefined && weather.humidity !== null) {
      return `${weather.humidity}%`;
    }
    // Fallback to database value only if weather is not available
    if (plant.humidity !== undefined && plant.humidity !== null) {
      return `${plant.humidity}%`;
    }
    return 'N/A';
  };

  const getWaterPHValue = () => {
    // pH doesn't come from weather API, so use database or Gemini
    if (phLoading) return 'Loading...';
    if (plant.waterPH !== undefined && plant.waterPH !== null && plant.waterPH !== 0) {
      return plant.waterPH.toString();
    }
    if (phAdvice && phAdvice !== 'No answer found') {
      // Clean up Gemini response (remove any extra text, keep only number)
      const phMatch = phAdvice.match(/[\d.]+/);
      return phMatch ? phMatch[0] : phAdvice;
    }
    return 'N/A';
  };

  const getTemperatureValue = () => {
    if (loading) return 'Loading...';
    // Prioritize real-time weather data over database values
    if (weather.temperature !== undefined && weather.temperature !== null) {
      return `${weather.temperature.toFixed(1)}°C`;
    }
    // Fallback to database value only if weather is not available
    if (plant.temperature !== undefined && plant.temperature !== null) {
      return `${Number(plant.temperature).toFixed(1)}°C`;
    }
    return '--';
  };

  return (
    <div className="relative w-full bg-white/60 backdrop-blur rounded-3xl border border-emerald-900/10 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 overflow-hidden">
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
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-emerald-400 object-cover"
          onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
        />
        <div className="text-center lg:text-left">
          <div className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-800">{plant.name}</div>
          <div className="text-sm sm:text-base text-emerald-700">{plant.species}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 z-10 min-w-0 w-full">
        <PlantStat
          icon={<Droplet size={24} className="text-emerald-500 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
          value={getHumidityValue()}
          label="Humidity"
          bg="bg-emerald-50 border border-emerald-200"
          valueClass="text-emerald-800"
        />
        <PlantStat
          icon={<Sparkles size={24} className="text-blue-400 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
          value={getWaterPHValue()}
          label="Water pH"
          bg="bg-sky-50 border border-sky-200"
          valueClass="text-sky-800"
        />
        <PlantStat
          icon={<Sun size={24} className="text-amber-500 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
          value={getTemperatureValue()}
          label="Temperature"
          bg="bg-amber-50 border border-amber-200"
          valueClass="text-amber-800"
        />
      </div>

    </div>
  );
};

export default FeaturedPlantCard; 