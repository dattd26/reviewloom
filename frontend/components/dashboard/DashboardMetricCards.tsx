import { ScanGrowthRecord } from '@/services/dashboard-service';

interface DashboardMetricCardsProps {
  totalScans: number;
  positivePercentage: number;
  newPrivateFeedback: number;
  scansGrowth: ScanGrowthRecord[];
}

function generateSparklinePoints(scansGrowth: ScanGrowthRecord[], width: number, height: number) {
  if (scansGrowth.length === 0) {
    return 'M0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,12';
  }

  const maxGrowthTotal = Math.max(...scansGrowth.map((g) => g.total), 1);
  return scansGrowth.map((g, index) => {
    const x = (index / Math.max(scansGrowth.length - 1, 1)) * width;
    const y = height - ((g.total / maxGrowthTotal) * (height - 10)) - 5;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
}

function generateSparklineAreaPoints(scansGrowth: ScanGrowthRecord[], width: number, height: number) {
  return `${generateSparklinePoints(scansGrowth, width, height)} L ${width} ${height} L 0 ${height} Z`;
}

export function DashboardMetricCards({ totalScans, positivePercentage, newPrivateFeedback, scansGrowth }: DashboardMetricCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="animate-slide-up bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-primary/20 hover:shadow-md transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-[2px] group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-xl transition-colors group-hover:bg-primary/15">
            <span className="material-symbols-outlined text-primary">qr_code_2</span>
          </div>
        </div>
        <p className="font-label text-[11px] font-bold text-outline uppercase tracking-[0.12em] mb-1.5">Total Scans</p>
        <h3 className="font-headline font-extrabold text-3xl mb-4 text-on-surface">{totalScans.toLocaleString()}</h3>
        <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 30">
          <defs>
            <linearGradient id="sparkline-total-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={generateSparklineAreaPoints(scansGrowth, 100, 30)} fill="url(#sparkline-total-grad)" />
          <path d={generateSparklinePoints(scansGrowth, 100, 30)} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="animate-slide-up bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-secondary/20 hover:shadow-md transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-[2px] group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-secondary/10 rounded-xl transition-colors group-hover:bg-secondary/15">
            <span className="material-symbols-outlined text-secondary">sentiment_very_satisfied</span>
          </div>
          <span className="material-symbols-outlined text-secondary text-sm animate-bounce">trending_up</span>
        </div>
        <p className="font-label text-[11px] font-bold text-outline uppercase tracking-[0.12em] mb-1.5">Positive Feedback %</p>
        <div className="flex items-baseline gap-2 mb-3">
          <h3 className="font-headline font-extrabold text-3xl text-secondary">{positivePercentage}%</h3>
          <span className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider">Routed to Google</span>
        </div>
        <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full transition-all duration-500" style={{ width: `${positivePercentage}%` }} />
        </div>
      </div>

      <div className={`animate-slide-up bg-surface-container-lowest p-6 rounded-2xl shadow-sm transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-[2px] group ${newPrivateFeedback > 0 ? 'border border-error/20 hover:border-error/40 hover:shadow-error/[0.02]' : 'border border-outline-variant/10 hover:border-outline/20 hover:shadow-md'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl transition-colors ${newPrivateFeedback > 0 ? 'bg-error/10' : 'bg-outline/10'}`}>
            <span className={`material-symbols-outlined ${newPrivateFeedback > 0 ? 'text-error' : 'text-outline'}`}>{newPrivateFeedback > 0 ? 'warning' : 'inbox'}</span>
          </div>
          {newPrivateFeedback > 0 && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
            </span>
          )}
        </div>
        <p className="font-label text-[11px] font-bold text-outline uppercase tracking-[0.12em] mb-1.5">New Private Feedback</p>
        <div className="flex items-baseline gap-2">
          <h3 className={`font-headline font-extrabold text-3xl ${newPrivateFeedback > 0 ? 'text-error' : 'text-on-surface'}`}>{newPrivateFeedback}</h3>
          <span className={`font-label text-[10px] font-bold uppercase tracking-wider ${newPrivateFeedback > 0 ? 'text-error' : 'text-outline opacity-70'}`}>
            {newPrivateFeedback > 0 ? 'Needs Attention' : 'All Cleared'}
          </span>
        </div>
        <p className="mt-4 text-xs text-outline leading-relaxed">
          {newPrivateFeedback > 0 ? `Action required on ${newPrivateFeedback} private response${newPrivateFeedback > 1 ? 's' : ''} from unhappy customers.` : 'No private complaints require attention at this time.'}
        </p>
      </div>
    </section>
  );
}
