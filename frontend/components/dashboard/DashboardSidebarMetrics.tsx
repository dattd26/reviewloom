import React from 'react';

interface DashboardSidebarMetricsProps {
  totalScans: number;
  positivePercentage: number;
  newPrivateFeedback: number;
}

export function DashboardSidebarMetrics({ totalScans, positivePercentage, newPrivateFeedback }: DashboardSidebarMetricsProps) {
  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* Total Scans Card */}
      <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/10 hover:border-primary/20 transition-all group">
        <div className="flex justify-between items-center mb-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
          </div>
        </div>
        <p className="font-label text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Total Customer Scans</p>
        <h3 className="font-headline font-black text-3xl text-on-surface">{totalScans.toLocaleString()}</h3>
      </div>

      {/* Positive Feedback % Card */}
      <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/10 hover:border-secondary/20 transition-all group">
        <div className="flex justify-between items-center mb-3">
          <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
            <span className="material-symbols-outlined text-[20px]">sentiment_very_satisfied</span>
          </div>
          <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
        </div>
        <p className="font-label text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Google Review Flow</p>
        <div className="flex items-baseline gap-2 mb-3">
          <h3 className="font-headline font-black text-3xl text-secondary">{positivePercentage}%</h3>
        </div>
        <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full" style={{ width: `${positivePercentage}%` }} />
        </div>
      </div>

      {/* Private Feedback Card */}
      <div className={`p-5 rounded-3xl shadow-sm transition-all border ${newPrivateFeedback > 0 ? 'bg-error/5 border-error/20 hover:border-error/40' : 'bg-surface-container-lowest border-outline-variant/10 hover:border-outline/20'}`}>
        <div className="flex justify-between items-center mb-3">
          <div className={`p-2 rounded-xl ${newPrivateFeedback > 0 ? 'bg-error/10 text-error' : 'bg-outline/10 text-outline'}`}>
            <span className="material-symbols-outlined text-[20px]">
              {newPrivateFeedback > 0 ? 'warning' : 'inbox'}
            </span>
          </div>
          {newPrivateFeedback > 0 && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
            </span>
          )}
        </div>
        <p className={`font-label text-[10px] font-bold uppercase tracking-wider mb-1 ${newPrivateFeedback > 0 ? 'text-error/80' : 'text-outline'}`}>
          Private Feedback
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className={`font-headline font-black text-3xl ${newPrivateFeedback > 0 ? 'text-error' : 'text-on-surface'}`}>
            {newPrivateFeedback}
          </h3>
          <span className={`font-label text-[9px] font-bold uppercase tracking-wider ${newPrivateFeedback > 0 ? 'text-error' : 'text-outline opacity-70'}`}>
            {newPrivateFeedback > 0 ? 'Needs Attention' : 'All Cleared'}
          </span>
        </div>
      </div>
    </div>
  );
}
