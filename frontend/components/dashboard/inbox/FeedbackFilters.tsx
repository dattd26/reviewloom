import { memo } from 'react';
import { CampaignResponse } from '@/services/campaign-service';

export type StatusFilter = 'all' | 'unread' | 'pending' | 'resolved';

interface FeedbackFiltersProps {
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  campaignFilter: string;
  setCampaignFilter: (id: string) => void;
  campaigns: CampaignResponse[];
}

export const FeedbackFilters = memo(({
  statusFilter,
  setStatusFilter,
  campaignFilter,
  setCampaignFilter,
  campaigns
}: FeedbackFiltersProps) => {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/10">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-white text-primary shadow-sm border border-outline-variant/5' : 'text-on-surface-variant hover:text-on-surface'}`}
        >All</button>
        <button
          onClick={() => setStatusFilter('unread')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'unread' ? 'bg-white text-primary shadow-sm border border-outline-variant/5' : 'text-on-surface-variant hover:text-on-surface'}`}
        >Unread</button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'pending' ? 'bg-white text-primary shadow-sm border border-outline-variant/5' : 'text-on-surface-variant hover:text-on-surface'}`}
        >Pending</button>
        <button
          onClick={() => setStatusFilter('resolved')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'resolved' ? 'bg-white text-primary shadow-sm border border-outline-variant/5' : 'text-on-surface-variant hover:text-on-surface'}`}
        >Resolved</button>
      </div>

      {/* Campaign Filter Select */}
      <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/15 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors">
        <span className="material-symbols-outlined text-sm">filter_list</span>
        <select
          className="bg-transparent border-none p-0 pr-6 text-xs font-semibold focus:ring-0 outline-none cursor-pointer"
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
        >
          <option value="all">All Campaigns</option>
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.businessName}</option>
          ))}
        </select>
      </div>
    </div>
  );
});

FeedbackFilters.displayName = 'FeedbackFilters';
