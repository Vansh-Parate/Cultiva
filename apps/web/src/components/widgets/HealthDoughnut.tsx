'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HealthDoughnutProps {
  value: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

const HealthDoughnut: React.FC<HealthDoughnutProps> = ({ value, label = 'Overall', size = 'medium' }) => {
  const data = [
    { name: 'Health', value: value },
    { name: 'Remaining', value: 100 - value }
  ];

  const sizeMap = {
    small: 'h-28',
    medium: 'h-36',
    large: 'h-56'
  };

  const fontSizes = {
    small: { main: 18, label: 11 },
    medium: { main: 22, label: 12 },
    large: { main: 26, label: 13 }
  };

  const CustomLabel = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div style={{ fontSize: `${fontSizes[size].main}px`, fontWeight: 600, color: '#059669' }}>
        {value}%
      </div>
      <div style={{ fontSize: `${fontSizes[size].label}px`, fontWeight: 500, color: '#64748b', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  );

  return (
    <div className={`relative w-full ${sizeMap[size]}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size === 'small' ? 30 : size === 'medium' ? 40 : 60}
            outerRadius={size === 'small' ? 45 : size === 'medium' ? 60 : 90}
            fill="#8884d8"
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            <Cell fill="rgb(16, 185, 129)" />
            <Cell fill="#E5E7EB" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <CustomLabel />
    </div>
  );
};

export default HealthDoughnut;
