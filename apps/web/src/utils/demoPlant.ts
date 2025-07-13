import { Plant } from './types';

export const demoFeaturedPlants: (Plant & {
  humidity: number;
  waterPH: number;
  temperature: string;
})[] = [
  {
    id: '1',
    name: 'Tomatoes',
    species: 'Solanum lycopersicum',
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    healthStatus: 'Good',
    nextCare: 'Water in 2 days',
    humidity: 72,
    waterPH: 3.4,
    temperature: '18-24°C',
  },
  {
    id: '2',
    name: 'Aloe Vera',
    species: 'Aloe barbadensis',
    photoUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80',
    healthStatus: 'Excellent',
    nextCare: 'Fertilize in 1 week',
    humidity: 60,
    waterPH: 6.5,
    temperature: '20-25°C',
  },
  {
    id: '3',
    name: 'Peace Lily',
    species: 'Spathiphyllum',
    photoUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    healthStatus: 'Fair',
    nextCare: 'Prune today',
    humidity: 80,
    waterPH: 5.8,
    temperature: '18-27°C',
  },
];