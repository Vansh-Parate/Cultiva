import React from 'react';
import { Droplet, Calendar, Leaf, Sliders } from 'lucide-react';

interface Plant {
  id: string;
  name: string;
  species: string;
  photoUrl?: string;
  moisture?: number;
  lastWatered?: string;
  healthScore?: number;
  status?: 'on-track' | 'needs-water' | 'needs-attention';
}

interface PlantCardsGridProps {
  plants?: Plant[];
  onFilterClick?: () => void;
}

const PlantCardsGrid: React.FC<PlantCardsGridProps> = ({
  plants = [
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
  ],
  onFilterClick
}) => {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'on-track':
        return (
          <div className="ml-auto inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-200">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            On track
          </div>
        );
      case 'needs-water':
        return (
          <div className="ml-auto inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-200">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Needs water
          </div>
        );
      case 'needs-attention':
        return (
          <div className="ml-auto inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs text-red-700 ring-1 ring-red-200">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Needs attention
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Your Plants</h3>
        <button
          onClick={onFilterClick}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50 transition-colors"
        >
          <Sliders className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <article
            key={plant.id}
            className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <img
                src={plant.photoUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=160&q=80'}
                alt={plant.name}
                className="h-12 w-12 rounded-lg object-cover ring-1 ring-emerald-200"
              />
              <div className="min-w-0">
                <h4 className="text-base tracking-tight font-semibold text-slate-900 truncate">
                  {plant.name}
                </h4>
                <p className="text-xs text-slate-500">{plant.species}</p>
              </div>
              {getStatusBadge(plant.status)}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              {/* Moisture */}
              <div className="rounded-lg border border-slate-100 p-3 bg-slate-50">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Droplet className="h-4 w-4 text-emerald-600" />
                  {plant.moisture}%
                </div>
                <p className="text-xs text-slate-500 mt-1">Moisture</p>
              </div>

              {/* Last Watered */}
              <div className="rounded-lg border border-slate-100 p-3 bg-slate-50">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  {plant.lastWatered}
                </div>
                <p className="text-xs text-slate-500 mt-1">Last watered</p>
              </div>

              {/* Health */}
              <div className="rounded-lg border border-slate-100 p-3 bg-slate-50">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                  {plant.healthScore}%
                </div>
                <p className="text-xs text-slate-500 mt-1">Health</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default PlantCardsGrid;
