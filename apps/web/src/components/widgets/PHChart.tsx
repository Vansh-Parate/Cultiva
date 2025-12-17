'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Beaker } from 'lucide-react';

interface PHChartProps {
  data?: number[];
  minTarget?: number;
  maxTarget?: number;
}

const PHChart: React.FC<PHChartProps> = ({
  data = [6.2, 6.1, 6.0, 5.9, 6.1, 6.2, 6.0, 6.1, 6.3, 6.2, 6.1, 6.0],
  minTarget = 5.5,
  maxTarget = 6.5
}) => {
  const chartData = data.map((value, index) => ({
    sample: `S${index + 1}`,
    ph: value
  }));

  return (
    <div className="rounded-lg border border-sky-100 bg-white shadow-sm p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Water pH Trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ideal: {minTarget}–{maxTarget}</p>
        </div>
        <Beaker className="h-4 w-4 text-sky-600 flex-shrink-0" />
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(56, 189, 248)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(56, 189, 248)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.5)" />
            <XAxis
              dataKey="sample"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              domain={[5, 7]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '6px',
                padding: '8px 12px'
              }}
              formatter={(value: number) => value.toFixed(2)}
              labelStyle={{ color: 'rgb(255, 255, 255)' }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <ReferenceLine
              y={minTarget}
              stroke="rgb(203, 213, 225)"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ value: `Min: ${minTarget}`, position: 'right', fill: '#64748b', fontSize: 11, offset: 5 }}
            />
            <ReferenceLine
              y={maxTarget}
              stroke="rgb(203, 213, 225)"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ value: `Max: ${maxTarget}`, position: 'right', fill: '#64748b', fontSize: 11, offset: -5 }}
            />
            <Line
              type="monotone"
              dataKey="ph"
              stroke="rgb(56, 189, 248)"
              fill="url(#colorPH)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PHChart;
