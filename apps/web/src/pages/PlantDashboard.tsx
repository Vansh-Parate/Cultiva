import React, { useState } from 'react';
import DashboardFeaturedPlantCard from '../components/widgets/DashboardFeaturedPlantCard';
import HealthDoughnut from '../components/widgets/HealthDoughnut';
import MoistureChart from '../components/widgets/MoistureChart';
import WateringChart from '../components/widgets/WateringChart';
import PHChart from '../components/widgets/PHChart';
import EnvironmentSnapshot from '../components/widgets/EnvironmentSnapshot';
import PlantCardsGrid from '../components/widgets/PlantCardsGrid';

interface Plant {
  id: string;
  name: string;
  species: string;
  photoUrl?: string;
  healthScore?: number;
  humidity?: number;
  waterPH?: number;
  temperature?: string;
  light?: string;
  moisture?: number;
  lastWatered?: string;
  status?: 'on-track' | 'needs-water' | 'needs-attention';
}

const PlantDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample featured plant data
  const featuredPlant: Plant = {
    id: '1',
    name: 'Adenium obesum',
    species: 'Desert Rose',
    photoUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=240&q=80',
    healthScore: 78,
    humidity: 69,
    waterPH: 6.0,
    temperature: '27.9°C',
    light: '5.5 hrs'
  };

  // Sample plants for grid
  const plantsData: Plant[] = [
    {
      id: '1',
      name: 'Fiddle Leaf Fig',
      species: 'Ficus lyrata',
      photoUrl: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=160&q=80',
      moisture: 54,
      lastWatered: '3d ago',
      healthScore: 82,
      status: 'on-track'
    },
    {
      id: '2',
      name: 'Snake Plant',
      species: 'Sansevieria',
      photoUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=160&q=80',
      moisture: 28,
      lastWatered: '8d ago',
      healthScore: 64,
      status: 'needs-water'
    },
    {
      id: '3',
      name: 'Monstera deliciosa',
      species: 'Swiss Cheese Plant',
      photoUrl: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80',
      moisture: 47,
      lastWatered: '2d ago',
      healthScore: 76,
      status: 'on-track'
    }
  ];

  const handleAddPlant = () => {
    // Navigate to add plant page or open modal
    window.location.href = '/find-plant';
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter plants based on search query
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Main Content Container */}
      <div className="w-full px-4 sm:px-5 lg:px-6 py-5 lg:py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">My Plants</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Manage your collection and keep them thriving</p>
        </div>

        {/* Featured Plant Section - Optimized for sidebar layout */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-4">
          {/* Featured Plant Card - Takes 2 columns */}
          <div className="xl:col-span-2">
            <DashboardFeaturedPlantCard plant={featuredPlant} />
          </div>

          {/* Health Score Doughnut - Compact version */}
          <div className="xl:col-span-1">
            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4 h-full flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Health Score</h3>
                  <p className="text-xs text-slate-500 mt-0.5">By humidity, pH & water</p>
                </div>
                <svg className="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0h-2m2 0V8m0 2v2m0-6h2m0 0h2m-2 0V8m0 2v2m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                <HealthDoughnut value={featuredPlant.healthScore ?? 78} label="Overall" size="medium" />
              </div>
              <div className="mt-2 w-full grid grid-cols-3 gap-1 text-xs">
                <div className="flex items-center gap-1 text-slate-600">
                  <span className="h-1 w-1 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span className="text-xs">Health</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <span className="h-1 w-1 rounded-full bg-slate-200 flex-shrink-0"></span>
                  <span className="text-xs">Rest</span>
                </div>
                <div className="text-slate-500 text-right text-xs">Now</div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section - 2-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          {/* Moisture Trend */}
          <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4">
            <MoistureChart />
          </div>

          {/* Watering Frequency */}
          <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4">
            <WateringChart />
          </div>
        </section>

        {/* pH and Environment Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          {/* pH Trend */}
          <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4">
            <PHChart />
          </div>

          {/* Environment Snapshot */}
          <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4">
            <EnvironmentSnapshot />
          </div>
        </section>

        {/* Plants Grid Section */}
        <section className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4">
          <PlantCardsGrid plants={plantsData} />
        </section>
      </div>
    </div>
  );
};

export default PlantDashboard;
