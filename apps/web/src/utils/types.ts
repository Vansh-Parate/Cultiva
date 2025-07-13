export interface Plant {
    id: string;
    name: string;
    species: string;
    photoUrl?: string;
    healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
    nextCare: string; 
    humidity: number; 
    waterPH: number;
    temperature: string;
  }