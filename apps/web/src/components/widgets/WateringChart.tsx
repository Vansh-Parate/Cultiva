'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarCheck } from 'lucide-react';

interface WateringChartProps {
  data?: number[];
}

const WateringChart: React.FC<WateringChartProps> = ({
  data = [1, 0, 1, 1, 0, 1]
}) => {
  const chartData = data.map((value, index) => ({
    week: `Wk ${index + 1}`,
    frequency: value
  }));

  const maxValue = Math.max(...data, 3);

  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Watering Frequency</h3>
          <p className="text-xs text-slate-500 mt-0.5">Past 6 weeks</p>
        </div>
        <CalendarCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
      </div>
      <div className="rounded-lg bg-slate-50 p-2 overflow-hidden">
        <div className="relative w-full" style={{ height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis
                dataKey="week"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                stroke="transparent"
              />
              <YAxis
                domain={[0, maxValue]}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                stroke="transparent"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '4px'
                }}
                formatter={(value: number) => `${value} times`}
                labelStyle={{ color: 'rgb(255, 255, 255)' }}
              />
              <Bar
                dataKey="frequency"
                fill="rgb(16, 185, 129)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default WateringChart;
