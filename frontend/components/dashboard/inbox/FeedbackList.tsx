import { memo } from 'react';
import { PrivateFeedback } from '@/services/inbox-service';

interface FeedbackListProps {
  isLoading: boolean;
  feedbackList: PrivateFeedback[];
  selectedFeedbackId?: string;
  onSelectFeedback: (feedback: PrivateFeedback) => void;
}

const getRelativeTimeString = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
};

export const FeedbackList = memo(({
  isLoading,
  feedbackList,
  selectedFeedbackId,
  onSelectFeedback
}: FeedbackListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 text-center text-sm text-outline">
        No private feedback found.
      </div>
    );
  }

  return (
    <>
      {feedbackList.map((feedback) => {
        const isSelected = selectedFeedbackId === feedback.id;
        return (
          <div
            key={feedback.id}
            onClick={() => onSelectFeedback(feedback)}
            className={`p-5 rounded-2xl shadow-sm cursor-pointer transition-all border ${isSelected
              ? 'bg-surface-container-lowest border-l-4 border-l-primary border-t border-r border-b border-outline-variant/15 shadow-md'
              : 'bg-surface-container-low/30 border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-lowest'
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-on-surface text-sm">
                {feedback.feedbackName || 'Anonymous Customer'}
              </h4>
              <span className="text-[10px] font-bold text-on-surface-variant">
                {getRelativeTimeString(feedback.scannedAt)}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mt-1">
              {feedback.feedbackMessage || '(No message content)'}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${feedback.status === 'unread' ? 'bg-error' : (feedback.status === 'pending' ? 'bg-amber-500' : 'bg-success')
                  }`}></span>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${feedback.status === 'unread' ? 'text-error' : (feedback.status === 'pending' ? 'text-amber-500' : 'text-success')
                  }`}>
                  {feedback.status}
                </span>
              </div>
              <span className="text-[10px] font-bold text-outline">★ {feedback.rating} / 5</span>
            </div>
          </div>
        );
      })}
    </>
  );
});

FeedbackList.displayName = 'FeedbackList';
