'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const chartData = Object.entries(activities).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
    value: count,
    emoji: {
      watering: '💧',
      fertilizing: '🌱',
      pruning: '✂️',
      repotting: '🪴',
      'pest-control': '🛡️'
    }[type as keyof typeof activities] || '📊',
    color: {
      watering: '#3b82f6',
      fertilizing: '#10b981',
      pruning: '#f59e0b',
      repotting: '#f97316',
      'pest-control': '#ef4444'
    }[type as keyof typeof activities] || '#6b7280'
  }));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600" />
        Care Activity (Last 30 Days)
      </h3>

      <div className="bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {chartData.map((item) => (
          <div key={item.name} className="text-center">
            <div className="text-2xl mb-1">{item.emoji}</div>
            <div className="text-xs font-medium text-gray-600">{item.name}</div>
            <div className="text-sm font-bold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HealthTrendChart: React.FC<{ data: HealthDataPoint[] }> = ({ data }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        Health Score Trend (Last 30 Days)
      </h3>

      <div className="bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value: any) => `${value}%`} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              fill="url(#colorScore)"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
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
            {(careActivityData as any).watering}
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
