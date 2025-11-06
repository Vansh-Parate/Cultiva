import React, { useEffect, useRef } from 'react';

interface HealthDoughnutProps {
  value: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

const HealthDoughnut: React.FC<HealthDoughnutProps> = ({ value, label = 'Overall', size = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect?.width || 200;
    const height = rect?.height || 200;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Colors
    const emerald500 = '#10b981';
    const gray200 = '#E5E7EB';

    // Draw doughnut
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    const innerRadius = radius * 0.72;

    // Calculate angles
    const healthAngle = (value / 100) * 2 * Math.PI - Math.PI / 2;

    // Draw remaining (background)
    ctx.fillStyle = gray200;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI * 1.5);
    ctx.arc(centerX, centerY, innerRadius, Math.PI * 1.5, -Math.PI / 2, true);
    ctx.fill();

    // Draw health (colored)
    ctx.fillStyle = emerald500;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, healthAngle);
    ctx.lineTo(centerX + Math.cos(healthAngle) * innerRadius, centerY + Math.sin(healthAngle) * innerRadius);
    ctx.arc(centerX, centerY, innerRadius, healthAngle, -Math.PI / 2, true);
    ctx.fill();

    // Draw center text
    ctx.save();
    ctx.font = `600 ${size === 'large' ? 26 : size === 'medium' ? 22 : 18}px Inter, sans-serif`;
    ctx.fillStyle = '#059669';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}%`, centerX, centerY - 6);

    ctx.font = `500 ${size === 'large' ? 12 : 11}px Inter, sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.fillText(label, centerX, centerY + 14);
    ctx.restore();
  }, [value, label, size]);

  const sizeMap = {
    small: 'h-28',
    medium: 'h-36',
    large: 'h-56'
  };

  return (
    <div className={`relative w-full ${sizeMap[size]}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default HealthDoughnut;
