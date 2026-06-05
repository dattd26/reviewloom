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
  return `0,${height} ${generateChartPoints(scansGrowth, key, maxVal, width, height)} ${width},${height} Z`;
}

export function ReviewGrowthChart({ scansGrowth }: ReviewGrowthChartProps) {
  const maxVal = scansGrowth.length > 0 ? Math.max(...scansGrowth.map((g) => g.total), 10) : 10;
  const lastIndex = scansGrowth.length - 1;
  const hasActivity = scansGrowth.some((day) => day.total > 0 || day.positive > 0 || day.negative > 0);

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
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 320">
              <defs>
                <linearGradient id="chart-grad-primary" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
                <filter id="shadow-total" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="var(--color-primary)" floodOpacity="0.12" />
                </filter>
                <filter id="shadow-positive" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="var(--color-secondary)" floodOpacity="0.1" />
                </filter>
              </defs>

              <line x1="0" y1="20" x2="1000" y2="20" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="0" y1="90" x2="1000" y2="90" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="0" y1="160" x2="1000" y2="160" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="0" y1="230" x2="1000" y2="230" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
              <line x1="0" y1="300" x2="1000" y2="300" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />

              <polygon points={generateAreaPoints(scansGrowth, 'total', maxVal, 1000, 320)} fill="url(#chart-grad-primary)" />
              <polyline points={generateChartPoints(scansGrowth, 'total', maxVal, 1000, 320)} fill="none" stroke="var(--color-primary)" strokeWidth="3.5" filter="url(#shadow-total)" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={generateChartPoints(scansGrowth, 'positive', maxVal, 1000, 320)} fill="none" stroke="var(--color-secondary)" strokeWidth="3" filter="url(#shadow-positive)" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={generateChartPoints(scansGrowth, 'negative', maxVal, 1000, 320)} fill="none" stroke="var(--color-error)" strokeWidth="2" strokeDasharray="5,5" strokeLinecap="round" />

              {hasActivity && (
                <>
                  <circle cx={1000} cy={320 - ((scansGrowth[lastIndex].total / maxVal) * 280) - 20} r="6" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                  <circle cx={1000} cy={320 - (((scansGrowth[lastIndex].positive || 0) / maxVal) * 280) - 20} r="6" fill="var(--color-secondary)" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                </>
              )}
            </svg>

            <div className="absolute left-6 top-4 bottom-4 flex flex-col justify-between text-[10px] font-label font-bold text-outline opacity-50 pointer-events-none select-none">
              <span>{maxVal}</span>
              <span>{Math.round(maxVal * 0.75)}</span>
              <span>{Math.round(maxVal * 0.5)}</span>
              <span>{Math.round(maxVal * 0.25)}</span>
              <span>0</span>
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
        <div className="flex justify-between mt-4 px-4 text-[9px] font-label font-bold text-outline uppercase tracking-[0.2em] opacity-60">
          <span>{formatChartDate(scansGrowth[0].date)}</span>
          <span>{formatChartDate(scansGrowth[Math.floor(scansGrowth.length / 2)].date)}</span>
          <span>{formatChartDate(scansGrowth[scansGrowth.length - 1].date)}</span>
        </div>
      )}
    </section>
  );
}
