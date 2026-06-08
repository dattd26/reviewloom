'use client';

import { useState } from 'react';
import { ScanGrowthRecord } from '@/services/dashboard-service';

interface ReviewGrowthChartProps {
  scansGrowth: ScanGrowthRecord[];
}

function formatChartDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

function generateChartPoints(scansGrowth: ScanGrowthRecord[], key: 'total' | 'positive' | 'negative', maxVal: number, width: number, height: number) {
  if (scansGrowth.length === 0) return '';

  return scansGrowth.map((g, index) => {
    const x = (index / Math.max(scansGrowth.length - 1, 1)) * width;
    const val = g[key] || 0;
    const y = height - ((val / maxVal) * (height - 40)) - 20;
    return `${x},${y}`;
  }).join(' ');
}

function generateAreaPoints(scansGrowth: ScanGrowthRecord[], key: 'total' | 'positive' | 'negative', maxVal: number, width: number, height: number) {
  if (scansGrowth.length === 0) return '';
  return `0,${height} ${generateChartPoints(scansGrowth, key, maxVal, width, height)} 1000,${height} Z`;
}

export function ReviewGrowthChart({ scansGrowth }: ReviewGrowthChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const maxVal = scansGrowth.length > 0 ? Math.max(...scansGrowth.map((g) => g.total), 10) : 10;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scansGrowth.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(percent * (scansGrowth.length - 1));
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Coordinates for hover indicators in the 1000x320 SVG viewBox space
  const svgX = hoveredIndex !== null ? (hoveredIndex / Math.max(scansGrowth.length - 1, 1)) * 1000 : 0;
  const hoveredData = hoveredIndex !== null ? scansGrowth[hoveredIndex] : null;

  const yTotal = hoveredData ? 320 - ((hoveredData.total / maxVal) * 280) - 20 : 0;
  const yPositive = hoveredData ? 320 - (((hoveredData.positive || 0) / maxVal) * 280) - 20 : 0;
  const yNegative = hoveredData ? 320 - (((hoveredData.negative || 0) / maxVal) * 280) - 20 : 0;

  const xPercent = hoveredIndex !== null ? (hoveredIndex / Math.max(scansGrowth.length - 1, 1)) * 100 : 0;
  const isLeftHalf = xPercent < 50;

  const tooltipStyle: React.CSSProperties = {
    left: `${xPercent}%`,
    transform: isLeftHalf ? 'translate(16px, 0)' : 'translate(calc(-100% - 16px), 0)',
  };

  return (
    <section className="animate-slide-up bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="font-headline font-bold text-lg text-on-surface tracking-tight">Review Growth Over Time</h3>
          <p className="font-label text-xs text-outline mt-1">Comparative view of scans versus customer feedback sentiment</p>
        </div>
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-label text-xs font-semibold text-on-surface-variant">Scans</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span className="font-label text-xs font-semibold text-on-surface-variant">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error" />
            <span className="font-label text-xs font-semibold text-on-surface-variant">Negative</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-80 bg-surface-container-low/20 rounded-2xl flex items-end p-4 overflow-hidden border border-outline-variant/5">
        {scansGrowth.length > 0 ? (
          <>
            {/* Y-axis labels positioned absolute on the left */}
            <div className="absolute left-6 top-4 bottom-4 flex flex-col justify-between text-[10px] font-label font-bold text-outline opacity-50 pointer-events-none select-none z-10">
              <span>{maxVal}</span>
              <span>{Math.round(maxVal * 0.75)}</span>
              <span>{Math.round(maxVal * 0.5)}</span>
              <span>{Math.round(maxVal * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Interactive chart wrapper inset by 40px (left-10 right-10) to prevent edge clipping */}
            <div 
              className="absolute inset-y-0 left-10 right-10 cursor-crosshair select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 320">
                <defs>
                  <linearGradient id="chart-grad-primary" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="1000" y2="20" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                <line x1="0" y1="90" x2="1000" y2="90" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                <line x1="0" y1="160" x2="1000" y2="160" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                <line x1="0" y1="230" x2="1000" y2="230" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                <line x1="0" y1="300" x2="1000" y2="300" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />

                {/* Growth paths */}
                <polygon points={generateAreaPoints(scansGrowth, 'total', maxVal, 1000, 320)} fill="url(#chart-grad-primary)" />
                <polyline points={generateChartPoints(scansGrowth, 'total', maxVal, 1000, 320)} fill="none" stroke="var(--color-primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={generateChartPoints(scansGrowth, 'positive', maxVal, 1000, 320)} fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={generateChartPoints(scansGrowth, 'negative', maxVal, 1000, 320)} fill="none" stroke="var(--color-error)" strokeWidth="2" strokeDasharray="5,5" strokeLinecap="round" />

                {/* Vertical line indicator and data points highlight on hover */}
                {hoveredIndex !== null && hoveredData && (
                  <>
                    <line
                      x1={svgX}
                      y1={0}
                      x2={svgX}
                      y2={320}
                      stroke="var(--color-outline-variant)"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      className="pointer-events-none opacity-40"
                    />
                    <circle
                      cx={svgX}
                      cy={yTotal}
                      r="6"
                      fill="var(--color-primary)"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="pointer-events-none shadow-sm"
                    />
                    <circle
                      cx={svgX}
                      cy={yPositive}
                      r="6"
                      fill="var(--color-secondary)"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="pointer-events-none shadow-sm"
                    />
                    <circle
                      cx={svgX}
                      cy={yNegative}
                      r="6"
                      fill="var(--color-error)"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="pointer-events-none shadow-sm"
                    />
                  </>
                )}
              </svg>

              {/* Premium details floating tooltip */}
              {hoveredIndex !== null && hoveredData && (
                <div
                  style={tooltipStyle}
                  className="absolute top-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-xl border border-outline-variant/20 shadow-lg min-w-[170px] pointer-events-none transition-opacity duration-150 flex flex-col gap-2"
                >
                  <div className="font-label text-[10px] font-bold text-outline uppercase tracking-wider border-b border-outline-variant/10 pb-1 mb-0.5">
                    {new Date(hoveredData.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-on-surface-variant">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span>Scans</span>
                      </div>
                      <span className="font-bold text-on-surface">{hoveredData.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        <span>Positive feedback</span>
                      </div>
                      <span className="font-bold text-secondary">{(hoveredData.positive || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-error" />
                        <span>Private feedback</span>
                      </div>
                      <span className="font-bold text-error">{(hoveredData.negative || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-sm text-outline opacity-60">
            <span className="material-symbols-outlined text-3xl">show_chart</span>
            <p className="font-semibold text-xs">No activity records in this date range</p>
          </div>
        )}
      </div>

      {scansGrowth.length > 0 && (
        <div className="flex justify-between mt-4 px-10 text-[9px] font-label font-bold text-outline uppercase tracking-[0.2em] opacity-60">
          <span>{formatChartDate(scansGrowth[0].date)}</span>
          <span>{formatChartDate(scansGrowth[Math.floor(scansGrowth.length / 2)].date)}</span>
          <span>{formatChartDate(scansGrowth[scansGrowth.length - 1].date)}</span>
        </div>
      )}
    </section>
  );
}
