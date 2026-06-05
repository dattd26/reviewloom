import Link from 'next/link';
import { RecentActivityRecord } from '@/services/dashboard-service';

interface RecentActivityTableProps {
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
  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function ActivityStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-1 text-secondary">
      {Array.from({ length: rating }).map((_, index) => (
        <span key={`filled-${index}`} className="material-symbols-outlined text-xs font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {Array.from({ length: Math.max(5 - rating, 0) }).map((_, index) => (
        <span key={`empty-${index}`} className="material-symbols-outlined text-xs">star</span>
      ))}
    </div>
  );
}

export function RecentActivityTable({ activities }: RecentActivityTableProps) {
  return (
    <section className="animate-slide-up space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-headline font-bold text-lg text-on-surface tracking-tight">Recent Activity</h3>
        <Link href="/dashboard/inbox" className="font-label text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-container transition-colors group">
          View Inbox
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low/40 border-b border-outline-variant/10">
              <tr>
                <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Event</th>
                <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Source</th>
                <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Status</th>
                <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center border border-outline-variant/15 text-outline/40 mb-4 animate-[pulse_3s_infinite]">
                        <span className="material-symbols-outlined text-3xl">query_stats</span>
                      </div>
                      <h4 className="text-sm font-headline font-bold text-on-surface mb-1">Awaiting Campaign Scans</h4>
                      <p className="text-xs text-outline leading-relaxed">
                        Once customers scan your QR codes and leave public reviews or private feedback, their activity will appear here in real-time.
                      </p>
                      <Link href="/dashboard/campaigns/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/15 transition-all text-xs font-headline font-bold rounded-lg border border-primary/10">
                        <span className="material-symbols-outlined text-sm">add_box</span>
                        Create a QR Campaign
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((activity) => {
                  const isPositive = activity.action === 'positive';
                  return (
                    <tr key={activity.id} className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${isPositive ? 'bg-secondary-container/20 text-on-secondary-container' : 'bg-error/10 text-error'}`}>
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isPositive ? "'FILL' 1" : '' }}>
                              {isPositive ? 'star' : 'feedback'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">
                              {isPositive ? `New ${activity.rating}-star review for ${activity.campaignBusinessName}` : `Private feedback received for ${activity.campaignBusinessName}`}
                            </p>
                            {activity.feedbackMessage && (
                              <p className="text-xs text-outline italic mt-1">&quot;{activity.feedbackMessage}&quot;</p>
                            )}
                            {isPositive && <ActivityStars rating={activity.rating} />}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-on-surface-variant">
                        {isPositive ? 'Google reviews' : 'Smart feedback flow'}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${isPositive ? 'bg-secondary-container/20 text-on-secondary-container border-secondary/10' : 'bg-error/10 text-error border-error/10'}`}>
                          {isPositive ? 'Published' : 'Private'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-outline">
                        {getRelativeTimeString(activity.scannedAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
