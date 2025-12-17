import React from 'react';
import { Cloud, Sun, Snowflake, Leaf } from 'lucide-react';

interface SeasonalCareTipsProps {
  currentSeason?: 'spring' | 'summer' | 'fall' | 'winter';
  tips?: string[];
}

const SeasonalCareTips: React.FC<SeasonalCareTipsProps> = ({
  currentSeason = 'spring',
  tips
}) => {
  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const season = currentSeason || getSeason();

  const seasonalTips = {
    spring: {
      icon: Leaf,
      title: 'Spring Care Tips',
      color: 'bg-green-50 border-green-100 text-green-700',
      tips: tips || [
        'Increase watering frequency as plants start growing',
        'Fertilize every 2 weeks during growing season',
        'Repot plants if they outgrow their containers',
        'Check for pests that become active in spring',
        'Prune dead or leggy growth from winter dormancy'
      ]
    },
    summer: {
      icon: Sun,
      title: 'Summer Care Tips',
      color: 'bg-yellow-50 border-yellow-100 text-yellow-700',
      tips: tips || [
        'Water more frequently in hot weather',
        'Provide shade for plants sensitive to direct sun',
        'Mist leaves to increase humidity',
        'Fertilize weekly during peak growth',
        'Monitor for heat stress and pests'
      ]
    },
    fall: {
      icon: Leaf,
      title: 'Fall Care Tips',
      color: 'bg-amber-50 border-amber-100 text-amber-700',
      tips: tips || [
        'Reduce watering frequency',
        'Stop fertilizing as growth slows',
        'Bring outdoor plants indoors before frost',
        'Prepare plants for dormancy',
        'Clean leaves to prepare for winter'
      ]
    },
    winter: {
      icon: Snowflake,
      title: 'Winter Care Tips',
      color: 'bg-blue-50 border-blue-100 text-blue-700',
      tips: tips || [
        'Water less frequently, only when soil is dry',
        'Provide supplemental light for plants',
        'Keep plants away from heating vents',
        'Maintain humidity with pebble trays',
        'Avoid fertilizing dormant plants'
      ]
    }
  };

  const config = seasonalTips[season];
  const Icon = config.icon;

  return (
    <div className={`mb-4 rounded-lg border ${config.color} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold text-sm">{config.title}</h3>
      </div>

      <ul className="space-y-2">
        {config.tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs">
            <span className="flex-shrink-0 h-4 w-4 rounded-full bg-current opacity-20 flex items-center justify-center mt-0.5">
              <span className="text-[0.5rem]">•</span>
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeasonalCareTips;
