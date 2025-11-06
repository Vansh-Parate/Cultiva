import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, Droplet, Leaf, Activity } from 'lucide-react';

interface HealthDataPoint {
  date: string;
  score: number;
  label: string;
}

interface PlantAnalyticsChartsProps {
  plant: {
    id: string;
    name: string;
    healthStatus: string;
  };
  careHistory?: Array<{
    id: string;
    careType: string;
    completedAt: string;
    notes?: string;
  }>;
}

// Simulated health trend data (in real app, would come from API)
const generateHealthTrendData = (plantId: string): HealthDataPoint[] => {
  const today = new Date();
  const data: HealthDataPoint[] = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const score = Math.max(40, Math.min(100, 70 + Math.random() * 30 - 10));

    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(score),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }

  return data;
};

// Simulated care activity data
const generateCareActivityData = (careHistory?: any[]) => {
  const careTypes = ['watering', 'fertilizing', 'pruning', 'repotting', 'pest-control'];
  const counts = {
    watering: careHistory?.filter(c => c.careType === 'watering').length || Math.floor(Math.random() * 8) + 4,
    fertilizing: careHistory?.filter(c => c.careType === 'fertilizing').length || Math.floor(Math.random() * 4) + 1,
    pruning: careHistory?.filter(c => c.careType === 'pruning').length || Math.floor(Math.random() * 3),
    repotting: careHistory?.filter(c => c.careType === 'repotting').length || Math.floor(Math.random() * 2),
    'pest-control': careHistory?.filter(c => c.careType === 'pest-control').length || Math.floor(Math.random() * 2)
  };

  return counts;
};

const CareActivityChart: React.FC<{ activities: Record<string, number> }> = ({ activities }) => {
  const maxValue = Math.max(...Object.values(activities), 1);
  const barHeight = 200;

  const activityLabels = {
    watering: { label: 'Watering', icon: '💧', color: 'bg-blue-500' },
    fertilizing: { label: 'Fertilizing', icon: '🌱', color: 'bg-emerald-500' },
    pruning: { label: 'Pruning', icon: '✂️', color: 'bg-amber-500' },
    repotting: { label: 'Repotting', icon: '🪴', color: 'bg-orange-500' },
    'pest-control': { label: 'Pest Control', icon: '🛡️', color: 'bg-red-500' }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600" />
        Care Activity (Last 30 Days)
      </h3>

      <div className="flex items-end justify-around h-64 bg-gray-50 rounded-lg p-4 gap-2">
        {(Object.entries(activities) as [string, number][]).map(([type, count]) => {
          const barValue = count === 0 ? 0 : (count / maxValue) * barHeight;
          const typeKey = type as keyof typeof activityLabels;
          const config = activityLabels[typeKey];

          return (
            <div key={type} className="flex flex-col items-center flex-1 gap-2">
              <div className="relative h-48 w-full flex items-end justify-center">
                <div
                  className={`${config.color} rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer w-3/4 min-h-4`}
                  style={{ height: `${Math.max(barValue, 4)}px` }}
                  title={`${config.label}: ${count}`}
                />
              </div>
              <span className="text-2xl">{config.icon}</span>
              <span className="text-xs font-medium text-gray-600 text-center">{config.label}</span>
              <span className="text-sm font-bold text-gray-900">{count}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 text-center">Bar height represents relative activity frequency</p>
    </div>
  );
};

const HealthTrendChart: React.FC<{ data: HealthDataPoint[] }> = ({ data }) => {
  const chartWidth = 480;
  const chartHeight = 200;
  const padding = 40;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  // Create SVG path for the trend line
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * innerWidth + padding;
    const y = chartHeight - ((point.score / 100) * innerHeight + padding);
    return { x, y, ...point };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        Health Score Trend (Last 30 Days)
      </h3>

      <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => (
            <line
              key={`grid-${percent}`}
              x1={padding}
              y1={chartHeight - (percent / 100) * innerHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - (percent / 100) * innerHeight - padding}
              stroke="#e5e7eb"
              strokeDasharray="4"
              strokeWidth="1"
            />
          ))}

          {/* Area under curve */}
          <path d={areaD} fill="#10b981" fillOpacity="0.1" />

          {/* Trend line */}
          <path d={pathD} stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((point, index) => (
            index % Math.ceil(data.length / 8) === 0 && (
              <circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#10b981"
                strokeWidth="2"
                stroke="white"
              />
            )
          ))}

          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map(percent => (
            <text
              key={`label-${percent}`}
              x={padding - 10}
              y={chartHeight - (percent / 100) * innerHeight - padding + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {percent}%
            </text>
          ))}

          {/* X-axis */}
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#d1d5db" strokeWidth="1" />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-emerald-50 rounded p-2">
          <p className="text-xs text-gray-600">Current</p>
          <p className="font-bold text-emerald-700">{data[data.length - 1].score}%</p>
        </div>
        <div className="bg-blue-50 rounded p-2">
          <p className="text-xs text-gray-600">Average</p>
          <p className="font-bold text-blue-700">{Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length)}%</p>
        </div>
        <div className="bg-purple-50 rounded p-2">
          <p className="text-xs text-gray-600">Trend</p>
          <p className="font-bold text-purple-700">
            {data[data.length - 1].score > data[Math.max(0, data.length - 8)].score ? '📈 Improving' : '📉 Declining'}
          </p>
        </div>
      </div>
    </div>
  );
};

const PlantAnalyticsCharts: React.FC<PlantAnalyticsChartsProps> = ({ plant, careHistory }) => {
  const healthTrendData = useMemo(() => generateHealthTrendData(plant.id), [plant.id]);
  const careActivityData = useMemo(() => generateCareActivityData(careHistory), [careHistory]);

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Health Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <HealthTrendChart data={healthTrendData} />
      </div>

      {/* Care Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <CareActivityChart activities={careActivityData} />
      </div>

      {/* Care Schedule Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Care Schedule Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
            <div className="flex items-center gap-2 mb-1">
              <Droplet className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-700">Watering</span>
            </div>
            <p className="text-sm text-gray-600">Every 3-4 days</p>
            <p className="text-xs text-gray-500 mt-1">Keep soil moist but not waterlogged</p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-400">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-gray-700">Fertilizing</span>
            </div>
            <p className="text-sm text-gray-600">Once a month</p>
            <p className="text-xs text-gray-500 mt-1">Use balanced NPK fertilizer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-amber-400">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-700">☀️ Light</span>
            </div>
            <p className="text-sm text-gray-600">Bright, indirect light</p>
            <p className="text-xs text-gray-500 mt-1">6-8 hours of quality light daily</p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-700">🌡️ Temperature</span>
            </div>
            <p className="text-sm text-gray-600">65-75°F (18-24°C)</p>
            <p className="text-xs text-gray-500 mt-1">Maintain consistent temperatures</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {healthTrendData[healthTrendData.length - 1].score}%
          </p>
          <p className="text-xs text-gray-600 mt-1">Current Health</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {careActivityData.watering}
          </p>
          <p className="text-xs text-gray-600 mt-1">Times Watered</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {Object.values(careActivityData).reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total Care Acts</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {Math.floor(Math.random() * 20) + 10}%
          </p>
          <p className="text-xs text-gray-600 mt-1">Health Trend</p>
        </div>
      </div>
    </div>
  );
};

export default PlantAnalyticsCharts;
