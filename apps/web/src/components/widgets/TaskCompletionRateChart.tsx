'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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

interface TaskCompletionRateChartProps {
  tasks?: CareTask[];
}

const TaskCompletionRateChart: React.FC<TaskCompletionRateChartProps> = ({ tasks = [] }) => {
  // Calculate completion rates by care type
  const getCompletionRates = () => {
    const rates: Record<string, { completed: number; total: number }> = {
      'watering': { completed: 0, total: 0 },
      'fertilizing': { completed: 0, total: 0 },
      'pruning': { completed: 0, total: 0 },
      'repotting': { completed: 0, total: 0 },
      'pest-control': { completed: 0, total: 0 }
    };

    tasks.forEach(task => {
      rates[task.type].total++;
      if (task.completed) {
        rates[task.type].completed++;
      }
    });

    return rates;
  };

  const rates = getCompletionRates();

  const chartData = Object.entries(rates).map(([type, { completed, total }]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
    completed: total > 0 ? Math.round((completed / total) * 100) : 0,
    pending: total > 0 ? Math.round(((total - completed) / total) * 100) : 0
  }));

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Completion Rate by Task Type</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.5)" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: 'rgb(148, 163, 184)', fontSize: 11 }}
              stroke="transparent"
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: 'rgb(148, 163, 184)', fontSize: 11 }}
              stroke="transparent"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '4px'
              }}
              formatter={(value: number) => `${value}%`}
              labelStyle={{ color: 'rgb(255, 255, 255)' }}
            />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="rgb(16, 185, 129)" name="Completed" />
            <Bar dataKey="pending" stackId="a" fill="rgba(203, 213, 225, 0.8)" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-600">
        <p>Completion percentage for each care task type</p>
      </div>
    </div>
  );
};

export default TaskCompletionRateChart;
