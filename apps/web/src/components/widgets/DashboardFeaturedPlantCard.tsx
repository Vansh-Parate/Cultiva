import React from 'react';
import { Droplet, Beaker, Thermometer, Sun, ThumbsUp } from 'lucide-react';

interface PlantData {
  id: string;
  name: string;
  species: string;
  photoUrl?: string;
  healthScore?: number;
  humidity?: number;
  waterPH?: number;
  temperature?: string;
  light?: string;
}

interface DashboardFeaturedPlantCardProps {
  plant: PlantData;
}

const DashboardFeaturedPlantCard: React.FC<DashboardFeaturedPlantCardProps> = ({ plant }) => {
  const healthScore = plant.healthScore ?? 78;
  const humidity = plant.humidity ?? 69;
  const waterPH = plant.waterPH ?? 6.0;
  const temperature = plant.temperature ?? '27.9°C';
  const light = plant.light ?? '5.5 hrs';

  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getHumidityStatus = (value: number) => {
    if (value >= 60) return 'Ok';
    if (value >= 40) return 'Low';
    return 'Critical';
  };

  const getPHStatus = (value: number) => {
    if (value >= 5.5 && value <= 6.5) return 'Slightly acidic';
    if (value < 5.5) return 'Very acidic';
    return 'Neutral';
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-sm">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(16,185,129,0.12),rgba(16,185,129,0)_70%)]"></div>

        <div className="relative p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <img
                src={plant.photoUrl || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=240&q=80'}
                alt={plant.name}
                className="h-14 w-14 rounded-lg object-cover ring-1 ring-emerald-200"
              />
              <div>
                <h2 className="text-2xl tracking-tight font-semibold text-slate-900">{plant.name}</h2>
                <p className="text-xs text-emerald-700 mt-0.5">{plant.species}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-medium ring-1 ring-emerald-200 whitespace-nowrap">
                <ThumbsUp className="h-3.5 w-3.5" />
                {getHealthStatus(healthScore)}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl tracking-tight font-semibold text-emerald-600">{healthScore}%</span>
                <span className="text-xs text-slate-500 whitespace-nowrap">health</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Humidity */}
            <div className="rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-7 w-7 rounded-md bg-emerald-50 text-emerald-600 inline-flex items-center justify-center ring-1 ring-emerald-100">
                  <Droplet className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium text-slate-600">Humidity</span>
              </div>
              <p className="text-lg tracking-tight font-semibold text-slate-900">{humidity}%</p>
              <p className="text-xs text-emerald-700 mt-1">{getHumidityStatus(humidity)}</p>
            </div>

            {/* Water pH */}
            <div className="rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-7 w-7 rounded-md bg-sky-50 text-sky-600 inline-flex items-center justify-center ring-1 ring-sky-100">
                  <Beaker className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium text-slate-600">pH</span>
              </div>
              <p className="text-lg tracking-tight font-semibold text-slate-900">{waterPH.toFixed(1)}</p>
              <p className="text-xs text-sky-700 mt-1">{getPHStatus(waterPH)}</p>
            </div>

            {/* Temperature */}
            <div className="rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-7 w-7 rounded-md bg-amber-50 text-amber-600 inline-flex items-center justify-center ring-1 ring-amber-100">
                  <Thermometer className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium text-slate-600">Temp</span>
              </div>
              <p className="text-lg tracking-tight font-semibold text-slate-900">{temperature}</p>
              <p className="text-xs text-amber-700 mt-1">Warm</p>
            </div>

            {/* Light */}
            <div className="rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-7 w-7 rounded-md bg-lime-50 text-lime-700 inline-flex items-center justify-center ring-1 ring-lime-100">
                  <Sun className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium text-slate-600">Light</span>
              </div>
              <p className="text-lg tracking-tight font-semibold text-slate-900">{light}</p>
              <p className="text-xs text-lime-700 mt-1">Bright</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeaturedPlantCard;
