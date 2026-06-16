import { DashboardDateRange } from '@/services/dashboard-service';

interface DashboardTopBarProps {
  firstName?: string | null;
  dateRange: DashboardDateRange;
  onDateRangeChange: (range: DashboardDateRange) => void;
}

export function DashboardTopBar({ firstName, dateRange, onDateRangeChange }: DashboardTopBarProps) {
  const handleDateChange = (field: keyof DashboardDateRange, value: string) => {
    onDateRangeChange({ ...dateRange, [field]: value });
  };

  return (
    <header className="animate-fade-in sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="px-8 h-auto min-h-20 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-headline font-black text-on-surface tracking-tight leading-none">
            Welcome back, {firstName || 'Owner'}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-outline mt-1.5 opacity-60">
            Reputation Overview
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-surface-container-lowest/80 px-4 py-3 rounded-xl border border-outline-variant/15">
            <span className="material-symbols-outlined text-outline text-sm hidden sm:inline">calendar_today</span>
            <label className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">From</span>
              <input
                type="date"
                value={dateRange.fromDate}
                max={dateRange.toDate}
                onChange={(event) => handleDateChange('fromDate', event.target.value)}
                className="bg-transparent text-[11px] font-bold text-on-surface-variant outline-none"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">To</span>
              <input
                type="date"
                value={dateRange.toDate}
                min={dateRange.fromDate}
                onChange={(event) => handleDateChange('toDate', event.target.value)}
                className="bg-transparent text-[11px] font-bold text-on-surface-variant outline-none"
              />
            </label>
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary transition-all rounded-xl hover:bg-primary/5 border border-outline-variant/15 hover:border-primary/20">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
}
