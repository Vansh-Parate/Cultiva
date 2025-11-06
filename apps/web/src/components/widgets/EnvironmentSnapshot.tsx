import React, { useEffect, useRef } from 'react';
import { Thermometer } from 'lucide-react';

interface EnvironmentSnapshotProps {
  temperature?: number;
  maxTemperature?: number;
  humidity?: number;
}

interface DoughnutProps {
  value: number;
  max: number;
  label: string;
  color: string;
  unit: string;
}

const Doughnut: React.FC<DoughnutProps> = ({ value, max, label, color, unit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect?.width || 150;
    const height = rect?.height || 150;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Colors
    const gray200 = '#E5E7EB';

    // Draw doughnut
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 5;
    const innerRadius = radius * 0.72;

    // Calculate angle
    const percentage = (value / max) * 100;
    const angle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;

    // Draw remaining (background)
    ctx.fillStyle = gray200;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI * 1.5);
    ctx.arc(centerX, centerY, innerRadius, Math.PI * 1.5, -Math.PI / 2, true);
    ctx.fill();

    // Draw colored portion
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, angle);
    ctx.lineTo(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius);
    ctx.arc(centerX, centerY, innerRadius, angle, -Math.PI / 2, true);
    ctx.fill();

    // Draw center text
    ctx.save();
    ctx.font = '600 18px Inter, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}${unit}`, centerX, centerY - 2);

    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(label, centerX, centerY + 12);
    ctx.restore();
  }, [value, max, label, color, unit]);

  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <p className="text-xs text-slate-600 mb-2 font-medium">{label}</p>
      <div className="relative w-full overflow-hidden" style={{ height: '120px' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
      <p className="mt-1 text-center text-xs text-slate-700">
        {value}{unit} of {max}{unit}
      </p>
    </div>
  );
};

const EnvironmentSnapshot: React.FC<EnvironmentSnapshotProps> = ({
  temperature = 27.9,
  maxTemperature = 35,
  humidity = 69
}) => {
  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Environment</h3>
          <p className="text-xs text-slate-500 mt-0.5">Room conditions</p>
        </div>
        <Thermometer className="h-4 w-4 text-amber-600 flex-shrink-0" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Doughnut
          value={temperature}
          max={maxTemperature}
          label="Temperature"
          color="#f59e0b"
          unit="°C"
        />
        <Doughnut
          value={humidity}
          max={100}
          label="Humidity"
          color="#10b981"
          unit="%"
        />
      </div>
    </>
  );
};

export default EnvironmentSnapshot;
