import React, { useEffect, useRef } from 'react';
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
    const width = rect?.width || 300;
    const height = rect?.height || 150;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Colors
    const sky400 = '#38bdf8';
    const gray300 = '#d1d5db';

    // Dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const minValue = 5;
    const maxValue = 7;

    // Draw grid
    ctx.strokeStyle = 'rgba(148,163,184,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw target lines (min and max)
    ctx.strokeStyle = gray300;
    ctx.setLineDash([5, 5]);
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
    gradient.addColorStop(0, 'rgba(56,189,248,0.25)');
    gradient.addColorStop(1, 'rgba(56,189,248,0.02)');

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
    ctx.strokeStyle = sky400;
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
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (i / 4) * (maxValue - minValue);
      const y = padding + (1 - i / 4) * chartHeight;
      ctx.fillText(value.toFixed(1), padding - 10, y);
    }
  }, [data, minTarget, maxTarget]);

  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Water pH Trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ideal: {minTarget}–{maxTarget}</p>
        </div>
        <Beaker className="h-4 w-4 text-sky-600 flex-shrink-0" />
      </div>
      <div className="rounded-lg bg-slate-50 p-2 overflow-hidden">
        <div className="relative w-full" style={{ height: '150px' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        </div>
      </div>
    </>
  );
};

export default PHChart;
