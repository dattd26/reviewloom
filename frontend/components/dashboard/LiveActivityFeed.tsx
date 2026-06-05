import Link from 'next/link';
import { RecentActivityRecord } from '@/services/dashboard-service';

interface LiveActivityFeedProps {
  activities: RecentActivityRecord[];
}

function getRelativeTimeString(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'Just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  return (
    <section className="animate-slide-up space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface tracking-tight">Real-time Activity Stream</h3>
        </div>
        <Link href="/dashboard/inbox" className="font-label text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-container transition-colors group">
          View All Inbox
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10">
        {activities.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center text-outline/40 mb-4 animate-[pulse_3s_infinite]">
              <span className="material-symbols-outlined text-3xl">radar</span>
            </div>
            <p className="font-headline font-bold text-sm text-on-surface">Listening for customer scans...</p>
            <p className="text-xs text-outline mt-1 max-w-[250px] mx-auto">When customers scan your QR codes, their feedback will appear here instantly.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-outline-variant/10 ml-4 space-y-8 pb-2">
            {activities.map((activity, i) => {
              const isPositive = activity.action === 'positive';
              return (
                <div key={activity.id} className="relative pl-8 group">
                  {/* Timeline Node */}
                  <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-[3px] border-surface-container-lowest flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${isPositive ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: isPositive ? "'FILL' 1" : '' }}>
                      {isPositive ? 'thumb_up' : 'feedback'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                    <div>
                      <p className="text-sm text-on-surface leading-tight">
                        <span className="font-bold">{isPositive ? 'Happy customer' : 'Customer'}</span>
                        {' '}scanned{' '}
                        <span className="font-bold text-on-surface-variant">{activity.campaignBusinessName}</span>
                      </p>
                      <p className="text-[11px] text-outline mt-0.5">
                        {isPositive 
                          ? 'Directed to Google review link' 
                          : 'Submitted private feedback form'}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider shrink-0 bg-surface-container-low/50 px-2 py-1 rounded-md">
                      {getRelativeTimeString(activity.scannedAt)}
                    </span>
                  </div>

                  {/* Feedback Content Box */}
                  {activity.feedbackMessage && (
                    <div className={`mt-3 p-3.5 rounded-2xl rounded-tl-sm text-sm italic border ${isPositive ? 'bg-secondary/5 border-secondary/10 text-on-surface-variant' : 'bg-error/5 border-error/10 text-on-surface-variant'}`}>
                      "{activity.feedbackMessage}"
                    </div>
                  )}
                  
                  {isPositive && activity.rating && (
                    <div className="flex items-center gap-0.5 mt-2.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className={`material-symbols-outlined text-[15px] ${idx < activity.rating! ? 'text-secondary font-fill' : 'text-outline/30'}`} style={{ fontVariationSettings: idx < activity.rating! ? "'FILL' 1" : '' }}>
                          star
                        </span>
                      ))}
                    </div>
                  )}

                  {!isPositive && (
                    <Link href="/dashboard/inbox" className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold text-primary hover:text-primary-container transition-colors bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10">
                      <span className="material-symbols-outlined text-[14px]">reply</span>
                      Reply to customer
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
