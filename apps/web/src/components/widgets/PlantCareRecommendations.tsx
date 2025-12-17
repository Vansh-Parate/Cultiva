import React from 'react';
import { AlertCircle, Lightbulb, Droplet, Thermometer, Leaf } from 'lucide-react';

interface RecommendationProps {
  title: string;
  recommendations: CareRecommendations;
}

interface CareRecommendations {
  watering?: string;
  light?: string;
  temperature?: string;
  fertilization?: string;
  general?: string;
}

const PlantCareRecommendations: React.FC<RecommendationProps> = ({
  title,
  recommendations = {
    watering: 'Water when top inch of soil is dry. Avoid waterlogging.',
    light: 'Bright indirect light. At least 6 hours of sunlight daily.',
    temperature: 'Keep between 18-25°C. Avoid cold drafts.',
    fertilization: 'Feed every 2-4 weeks during growing season.',
    general: 'Dust leaves monthly. Repot every 12-18 months.'
  }
}) => {
  const items = [
    { icon: Droplet, label: 'Watering', text: recommendations.watering, color: 'text-blue-600' },
    { icon: Lightbulb, label: 'Light', text: recommendations.light, color: 'text-yellow-600' },
    { icon: Thermometer, label: 'Temperature', text: recommendations.temperature, color: 'text-red-600' },
    { icon: Leaf, label: 'Fertilization', text: recommendations.fertilization, color: 'text-green-600' }
  ];

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-4 w-4 text-emerald-600" />
        <h3 className="text-sm font-semibold text-slate-900">Care Recommendations: {title}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            item.text && (
              <div key={idx} className="flex gap-3">
                <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${item.color}`} />
                <div>
                  <p className="text-xs font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{item.text}</p>
                </div>
              </div>
            )
          );
        })}
        {recommendations.general && (
          <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-700">
              <span className="font-medium">General tip:</span> {recommendations.general}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCareRecommendations;
