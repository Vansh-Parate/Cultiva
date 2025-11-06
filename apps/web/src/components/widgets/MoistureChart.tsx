import React, { useEffect, useRef } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const container = canvas.parentElement;
    const rect = container?.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect?.width || 500;
    const height = rect?.height || 180;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Colors
    const emerald500 = '#10b981';
    const gray300 = '#d1d5db';

    // Dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const minValue = 20;
    const maxValue = 80;

    // Draw grid
    ctx.strokeStyle = 'rgba(148,163,184,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const y = padding + (i / 6) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw target lines (min and max)
    ctx.strokeStyle = gray300;
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1;

    const minY = padding + chartHeight - ((minTarget - minValue) / (maxValue - minValue)) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, minY);
    ctx.lineTo(width - padding, minY);
    ctx.stroke();

    const maxY = padding + chartHeight - ((maxTarget - minValue) / (maxValue - minValue)) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, maxY);
    ctx.lineTo(width - padding, maxY);
    ctx.stroke();

    ctx.setLineDash([]);

    // Calculate points
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      return { x, y, value };
    });

    // Draw area under curve
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
    gradient.addColorStop(0, 'rgba(16,185,129,0.25)');
    gradient.addColorStop(1, 'rgba(16,185,129,0.02)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(width - padding, padding + chartHeight);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = emerald500;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 6; i++) {
      const value = minValue + (i / 6) * (maxValue - minValue);
      const y = padding + (1 - i / 6) * chartHeight;
      ctx.fillText(`${Math.round(value)}%`, padding - 10, y);
    }

    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const tickInterval = Math.ceil(data.length / 8);
    for (let i = 0; i < data.length; i += tickInterval) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      ctx.fillText(`D${i + 1}`, x, height - padding + 5);
    }
  }, [data, minTarget, maxTarget]);

  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Soil Moisture</h3>
          <p className="text-xs text-slate-500 mt-0.5">Target: {minTarget}–{maxTarget}%</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs ring-1 ring-emerald-200 whitespace-nowrap">
          <Droplets className="h-3 w-3" />
          Stable
        </span>
      </div>
      <div className="rounded-lg bg-slate-50 p-2 overflow-hidden">
        <div className="relative w-full" style={{ height: '180px' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        </div>
      </div>
    </>
  );
};

export default MoistureChart;
