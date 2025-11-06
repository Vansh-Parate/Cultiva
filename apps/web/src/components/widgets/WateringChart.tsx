import React, { useEffect, useRef } from 'react';
import { CalendarCheck } from 'lucide-react';

interface WateringChartProps {
  data?: number[];
}

const WateringChart: React.FC<WateringChartProps> = ({
  data = [1, 0, 1, 1, 0, 1]
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
    const height = rect?.height || 180;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Colors
    const emerald500 = '#10b981';

    // Dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = Math.max(20, Math.min(40, chartWidth / (data.length * 1.5)));
    const maxValue = Math.max(...data, 3);

    // Draw grid
    ctx.strokeStyle = 'rgba(148,163,184,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = padding + (i / 3) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw bars
    ctx.fillStyle = emerald500;
    const spacing = chartWidth / data.length;
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + (index + 0.5) * spacing - barWidth / 2;
      const y = padding + chartHeight - barHeight;

      // Draw rounded rectangle
      ctx.fillRect(x, y, barWidth, barHeight);

      // Rounded corners approximation
      const radius = 4;
      ctx.clearRect(x, y, radius, radius);
      ctx.clearRect(x + barWidth - radius, y, radius, radius);
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 3; i++) {
      const y = padding + (1 - i / 3) * chartHeight;
      ctx.fillText(`${i}`, padding - 10, y);
    }

    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const labels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'];
    labels.forEach((label, index) => {
      const x = padding + (index + 0.5) * spacing;
      ctx.fillText(label, x, height - padding + 5);
    });
  }, [data]);

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
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        </div>
      </div>
    </>
  );
};

export default WateringChart;
