'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState, useCallback, useRef } from 'react';
import { InboxService, PrivateFeedback } from '@/services/inbox-service';
import { CampaignService, CampaignResponse } from '@/services/campaign-service';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { FeedbackSearch } from '@/components/dashboard/inbox/FeedbackSearch';
import { FeedbackFilters, StatusFilter } from '@/components/dashboard/inbox/FeedbackFilters';
import { FeedbackList } from '@/components/dashboard/inbox/FeedbackList';
import { FeedbackDetail } from '@/components/dashboard/inbox/FeedbackDetail';

export default function FeedbackInbox() {
  const { getToken } = useAuth();
  const [feedbackList, setFeedbackList] = useState<PrivateFeedback[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<PrivateFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a ref to track selectedFeedback to prevent infinite rendering loops in loadFeedback
  const selectedFeedbackRef = useRef<PrivateFeedback | null>(null);
  useEffect(() => {
    selectedFeedbackRef.current = selectedFeedback;
  }, [selectedFeedback]);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Load campaigns for filter dropdown
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const data = await CampaignService.getMyCampaigns(token);
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to load campaigns for filter:", error);
      }
    };
    loadCampaigns();
  }, [getToken]);

  const handleMarkStatus = useCallback(async (id: string, newStatus: 'unread' | 'pending' | 'resolved') => {
    try {
      const token = await getToken();
      if (!token) return;
      await InboxService.updateStatus(token, id, newStatus);

      // Update local state
      setFeedbackList(prev =>
        prev.map(f => f.id === id ? { ...f, status: newStatus } : f)
      );
      setSelectedFeedback(prev => {
        if (prev && prev.id === id) {
          return { ...prev, status: newStatus };
        }
        return prev;
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }, [getToken]);

  const handleReplySuccess = useCallback((id: string, replyMessage: string, repliedAt: string) => {
    setFeedbackList(prev =>
      prev.map(f => f.id === id ? {
        ...f,
        status: 'resolved',
        replyMessage,
        repliedAt
      } : f)
    );
    setSelectedFeedback(prev => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          status: 'resolved',
          replyMessage,
          repliedAt
        };
      }
      return prev;
    });
  }, []);

  const handleSelectFeedback = useCallback(async (feedback: PrivateFeedback) => {
    setSelectedFeedback(feedback);
    if (feedback.status === 'unread') {
      await handleMarkStatus(feedback.id, 'pending');
    }
  }, [handleMarkStatus]);

  // Load private feedback list
  const loadFeedback = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const params = {
        status: statusFilter,
        campaignId: campaignFilter !== 'all' ? campaignFilter : undefined,
        search: debouncedSearch || undefined
      };

      const data = await InboxService.getFeedbackList(token, params);
      setFeedbackList(data);

      // Preserve selection if it still exists in the new list, otherwise select the first item or null
      const currentSelected = selectedFeedbackRef.current;
      if (data.length > 0) {
        const stillExists = currentSelected ? data.find(f => f.id === currentSelected.id) : null;
        if (stillExists) {
          setSelectedFeedback(stillExists);
        } else {
          setSelectedFeedback(data[0]);
          // Mark the first item as pending/read if it was unread
          if (data[0].status === 'unread') {
            handleMarkStatus(data[0].id, 'pending');
          }
        }
      } else {
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error("Failed to load feedback inbox:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, statusFilter, campaignFilter, debouncedSearch, handleMarkStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeedback();
  }, [loadFeedback]);

  if (isLoading && feedbackList.length === 0) {
    return <DashboardLoading title="Loading Private Feedback..." description="Accessing customer inbox" />;
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* TopAppBar Shell */}
      <header className="flex justify-between items-center w-full px-8 py-4 bg-white/85 backdrop-blur-xl border-b border-outline-variant/10 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <FeedbackSearch onSearchChange={setDebouncedSearch} />
        </div>
        <div className="flex items-center gap-6">
          <button className="text-outline hover:text-primary transition-colors hover:bg-surface-container-high p-2 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface hidden sm:inline-block">The Editorial Ledger</span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface">
        {/* Page Header & Filters */}
        <div className="px-8 py-6 flex flex-col gap-6 shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Private Feedback</h2>
              <p className="text-on-surface-variant font-medium mt-1 text-sm">Managing customer responses from the private feedback flow.</p>
            </div>
          </div>

          <FeedbackFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            campaignFilter={campaignFilter}
            setCampaignFilter={setCampaignFilter}
            campaigns={campaigns}
          />
        </div>

        {/* Layout Wrapper */}
        <div className="flex-1 flex overflow-hidden px-4 sm:px-8 pb-8 gap-6">

          {/* Left Column: Message List (35%) */}
          <section className="w-full sm:w-[350px] flex flex-col gap-4 overflow-y-auto pr-2 shrink-0">
            <FeedbackList
              isLoading={isLoading}
              feedbackList={feedbackList}
              selectedFeedbackId={selectedFeedback?.id}
              onSelectFeedback={handleSelectFeedback}
            />
          </section>

          {/* Right Column: Detail View (65%) */}
          <section className="flex-1 bg-surface-container-lowest rounded-2xl flex flex-col shadow-sm border border-outline-variant/10 overflow-hidden">
            {selectedFeedback ? (
              <FeedbackDetail
                key={selectedFeedback.id}
                feedback={selectedFeedback}
                onReplySuccess={handleReplySuccess}
                onMarkStatus={handleMarkStatus}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-outline p-8">
                <span className="material-symbols-outlined text-5xl mb-2">inbox</span>
                <p className="text-sm font-semibold">Select a feedback message to view details</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
