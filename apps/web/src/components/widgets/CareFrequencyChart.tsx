'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface CareFrequencyChartProps {
  tasks?: CareTask[];
}

const CareFrequencyChart: React.FC<CareFrequencyChartProps> = ({ tasks = [] }) => {
  // Calculate tasks completed over the last 7 days
  const getLast7DaysTasks = () => {
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const completedTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return task.completed && taskDate >= dayStart && taskDate <= dayEnd;
      }).length;

      data.push({
        date: dateStr,
        completed: completedTasks
      });
    }

    return data;
  };

  const chartData = getLast7DaysTasks();

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Weekly Care Frequency</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.5)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgb(148, 163, 184)', fontSize: 11 }}
              stroke="transparent"
            />
            <YAxis
              tick={{ fill: 'rgb(148, 163, 184)', fontSize: 11 }}
              stroke="transparent"
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '4px'
              }}
              formatter={(value: number) => `${value} completed`}
              labelStyle={{ color: 'rgb(255, 255, 255)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '12px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="rgb(16, 185, 129)"
              fill="rgba(16, 185, 129, 0.1)"
              strokeWidth={2}
              dot={{ fill: 'rgb(16, 185, 129)', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              name="Completed Tasks"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-600">
        <p>Tasks completed over the last 7 days</p>
      </div>
    </div>
  );
};

export default CareFrequencyChart;
