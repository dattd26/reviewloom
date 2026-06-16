import { useState, memo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { PrivateFeedback, InboxService } from '@/services/inbox-service';
import toast from 'react-hot-toast';

interface FeedbackDetailProps {
  feedback: PrivateFeedback;
  onReplySuccess: (id: string, replyMessage: string, repliedAt: string) => void;
  onMarkStatus: (id: string, status: 'unread' | 'pending' | 'resolved') => void;
}

export const FeedbackDetail = memo(({
  feedback,
  onReplySuccess,
  onMarkStatus
}: FeedbackDetailProps) => {
  const { getToken } = useAuth();
  const [replyText, setReplyText] = useState(feedback.replyMessage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim() || !feedback.feedbackEmail) return;
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) return;
      await InboxService.sendReply(token, feedback.id, replyText);
      const repliedAt = new Date().toISOString();
      onReplySuccess(feedback.id, replyText, repliedAt);
      toast.success("Reply sent and marked as resolved.");
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Detail Header */}
      <div className="p-6 sm:p-8 bg-surface-container-low/30 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm">
            {(feedback.feedbackName || 'A')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-on-surface">
              {feedback.feedbackName || 'Anonymous Customer'}
            </h3>
            <div className="flex flex-col sm:flex-row sm:gap-4 mt-1.5 gap-1">
              <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                {feedback.feedbackEmail || 'No email provided'}
              </span>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">ads_click</span>
                Campaign: {feedback.campaignBusinessName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-extrabold uppercase tracking-widest border border-error/20">
              Rating: {feedback.rating} Star{feedback.rating > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-outline font-medium">
              Received: {new Date(feedback.scannedAt).toLocaleString()}
            </span>
          </div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-outline mb-4">Customer Private Feedback</h4>
          <div className="bg-surface/50 p-6 rounded-2xl border border-outline-variant/10 mb-8">
            <p className="text-[15px] leading-relaxed text-on-surface font-medium italic">
              {feedback.feedbackMessage ? `"${feedback.feedbackMessage}"` : 'No detailed comment written.'}
            </p>
          </div>

          {feedback.replyMessage && (
            <>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-outline mb-4">Your Private Response</h4>
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <p className="text-[15px] leading-relaxed text-on-surface font-medium">
                  {`"${feedback.replyMessage}"`}
                </p>
                <p className="text-[10px] text-outline mt-3">
                  Sent at: {feedback.repliedAt ? new Date(feedback.repliedAt).toLocaleString() : ''}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Response Area */}
      <div className="p-6 sm:p-8 border-t border-outline-variant/10 bg-surface-container-low/20 shrink-0">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-outline mb-4">Reply via Email</h4>
        <div className="relative bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
          <textarea
            className="w-full p-4 text-sm font-body border-none focus:ring-0 resize-none bg-transparent outline-none text-on-surface placeholder:text-outline"
            placeholder={feedback.feedbackEmail ? "Write your professional response here..." : "Cannot reply directly (no email provided)"}
            rows={3}
            value={replyText}
            disabled={!feedback.feedbackEmail || isSubmitting}
            onChange={(e) => setReplyText(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleSendReply}
              disabled={!feedback.feedbackEmail || !replyText.trim() || isSubmitting}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary-container text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">send</span>
                  Send Reply
                </>
              )}
            </button>

            {feedback.status !== 'resolved' && (
              <button
                onClick={() => onMarkStatus(feedback.id, 'resolved')}
                className="flex-1 sm:flex-none bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all active:scale-95 border border-outline-variant/10"
              >
                Mark as Resolved
              </button>
            )}

            {feedback.status === 'resolved' && (
              <button
                onClick={() => onMarkStatus(feedback.id, 'pending')}
                className="flex-1 sm:flex-none bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all active:scale-95 border border-outline-variant/10"
              >
                Reopen Feedback
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

FeedbackDetail.displayName = 'FeedbackDetail';
