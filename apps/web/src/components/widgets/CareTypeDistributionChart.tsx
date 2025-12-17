'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CareTask {
  id: string;
  plantName: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  dueDate: string;
  completed: boolean;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

interface CareTypeDistributionChartProps {
  tasks?: CareTask[];
}

const CareTypeDistributionChart: React.FC<CareTypeDistributionChartProps> = ({ tasks = [] }) => {
  // Calculate task distribution by type
  const getTaskDistribution = () => {
    const distribution: Record<string, number> = {
      'watering': 0,
      'fertilizing': 0,
      'pruning': 0,
      'repotting': 0,
      'pest-control': 0
    };

    tasks.forEach(task => {
      distribution[task.type]++;
    });

    return distribution;
  };

  const distribution = getTaskDistribution();
  const colors = [
    '#3b82f6',   // Blue - watering
    '#22c55e',   // Green - fertilizing
    '#fb923c',   // Orange - pruning
    '#10b981',   // Emerald - repotting
    '#ef4444'    // Red - pest-control
  ];

  const chartData = Object.entries(distribution).map(([type, count], index) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
    value: count,
    color: colors[index]
  })).filter(item => item.value > 0);

  if (chartData.length === 0) {
    chartData.push({ name: 'No Data', value: 1, color: '#e5e7eb' });
  }

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Task Distribution by Type</h3>
      <div className="h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '4px'
              }}
              formatter={(value: number, name: string, props: any) => {
                const total = chartData.reduce((sum, item) => sum + item.value, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${value} (${percentage}%)`;
              }}
              labelStyle={{ color: 'rgb(255, 255, 255)' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-600">
        <p>Breakdown of all care tasks by type</p>
      </div>
    </div>
  );
};

export default CareTypeDistributionChart;
