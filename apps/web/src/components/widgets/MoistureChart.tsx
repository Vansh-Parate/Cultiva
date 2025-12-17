'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Droplets } from 'lucide-react';

interface MoistureChartProps {
  data?: number[];
  minTarget?: number;
  maxTarget?: number;
}

const MoistureChart: React.FC<MoistureChartProps> = ({
  data = [48, 52, 55, 57, 53, 50, 46, 44, 42, 40, 45, 47, 49, 51, 54, 56, 58, 55, 52, 50, 48, 47, 45, 43, 46, 49, 52, 54, 53, 51],
  minTarget = 35,
  maxTarget = 60
}) => {
  const chartData = data.map((value, index) => ({
    day: `D${index + 1}`,
    moisture: value
  }));

  return (
    <div className="rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Soil Moisture</h3>
          <p className="text-xs text-slate-500 mt-0.5">Target: {minTarget}–{maxTarget}%</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs ring-1 ring-emerald-200 whitespace-nowrap">
          <Droplets className="h-3 w-3" />
          Stable
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(16, 185, 129)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(16, 185, 129)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.5)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              interval={Math.ceil(data.length / 8) - 1}
            />
            <YAxis
              domain={[20, 80]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                padding: '8px 12px'
              }}
              formatter={(value: number) => [`${value}%`, 'Moisture']}
              labelStyle={{ color: 'rgb(255, 255, 255)' }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <ReferenceLine
              y={minTarget}
              stroke="rgb(203, 213, 225)"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ value: `Min: ${minTarget}%`, position: 'right', fill: '#64748b', fontSize: 11, offset: 5 }}
            />
            <ReferenceLine
              y={maxTarget}
              stroke="rgb(203, 213, 225)"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ value: `Max: ${maxTarget}%`, position: 'right', fill: '#64748b', fontSize: 11, offset: -5 }}
            />
            <Area
              type="monotone"
              dataKey="moisture"
              stroke="rgb(16, 185, 129)"
              fill="url(#colorMoisture)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoistureChart;
