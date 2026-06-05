'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { InboxService, PrivateFeedback } from '@/services/inbox-service';
import { CampaignService, CampaignResponse } from '@/services/campaign-service';

export default function FeedbackInbox() {
  const { getToken } = useAuth();
  const [feedbackList, setFeedbackList] = useState<PrivateFeedback[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<PrivateFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'pending' | 'resolved'>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Form state
  const [replyText, setReplyText] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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

  // Load private feedback list
  const loadFeedback = async () => {
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
      if (data.length > 0) {
        const stillExists = selectedFeedback ? data.find(f => f.id === selectedFeedback.id) : null;
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
  };

  useEffect(() => {
    loadFeedback();
  }, [getToken, statusFilter, campaignFilter, debouncedSearch]);

  const handleSelectFeedback = async (feedback: PrivateFeedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.replyMessage || '');
    if (feedback.status === 'unread') {
      await handleMarkStatus(feedback.id, 'pending');
    }
  };

  const handleMarkStatus = async (id: string, newStatus: 'unread' | 'pending' | 'resolved') => {
    try {
      const token = await getToken();
      if (!token) return;
      await InboxService.updateStatus(token, id, newStatus);
      
      // Update local state
      setFeedbackList(prev => 
        prev.map(f => f.id === id ? { ...f, status: newStatus } : f)
      );
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedFeedback || !replyText.trim()) return;
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) return;
      await InboxService.sendReply(token, selectedFeedback.id, replyText);
      
      // Update local state
      setFeedbackList(prev => 
        prev.map(f => f.id === selectedFeedback.id ? { 
          ...f, 
          status: 'resolved', 
          replyMessage: replyText, 
          repliedAt: new Date().toISOString() 
        } : f)
      );
      setSelectedFeedback(prev => prev ? { 
        ...prev, 
        status: 'resolved', 
        replyMessage: replyText, 
        repliedAt: new Date().toISOString() 
      } : null);
      
      alert("Reply logged and marked as resolved.");
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* TopAppBar Shell */}
      <header className="flex justify-between items-center w-full px-8 py-4 bg-white/85 backdrop-blur-xl border-b border-outline-variant/10 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 rounded-xl transition-all">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-body focus:ring-0 text-on-surface placeholder:text-outline"
              placeholder="Search feedback..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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

          {/* Filter Bar */}
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
        </div>

        {/* Layout Wrapper */}
        <div className="flex-1 flex overflow-hidden px-4 sm:px-8 pb-8 gap-6">

          {/* Left Column: Message List (35%) */}
          <section className="w-full sm:w-[350px] flex flex-col gap-4 overflow-y-auto pr-2 shrink-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Loading...</p>
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 text-center text-sm text-outline">
                No private feedback found.
              </div>
            ) : (
              feedbackList.map((feedback) => {
                const isSelected = selectedFeedback?.id === feedback.id;
                return (
                  <div 
                    key={feedback.id}
                    onClick={() => handleSelectFeedback(feedback)}
                    className={`p-5 rounded-2xl shadow-sm cursor-pointer transition-all border ${
                      isSelected 
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
                        <span className={`w-2 h-2 rounded-full ${
                          feedback.status === 'unread' ? 'bg-error' : (feedback.status === 'pending' ? 'bg-amber-500' : 'bg-success')
                        }`}></span>
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                          feedback.status === 'unread' ? 'text-error' : (feedback.status === 'pending' ? 'text-amber-500' : 'text-success')
                        }`}>
                          {feedback.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-outline">★ {feedback.rating} / 5</span>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {/* Right Column: Detail View (65%) */}
          <section className="flex-1 bg-surface-container-lowest rounded-2xl flex flex-col shadow-sm border border-outline-variant/10 overflow-hidden">
            {selectedFeedback ? (
              <>
                {/* Detail Header */}
                <div className="p-6 sm:p-8 bg-surface-container-low/30 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm">
                      {(selectedFeedback.feedbackName || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-on-surface">
                        {selectedFeedback.feedbackName || 'Anonymous Customer'}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:gap-4 mt-1.5 gap-1">
                        <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">mail</span>
                          {selectedFeedback.feedbackEmail || 'No email provided'}
                        </span>
                        <span className="hidden sm:inline text-outline-variant">•</span>
                        <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">ads_click</span>
                          Campaign: {selectedFeedback.campaignBusinessName}
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
                        Rating: {selectedFeedback.rating} Star{selectedFeedback.rating > 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-outline font-medium">
                        Received: {new Date(selectedFeedback.scannedAt).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-outline mb-4">Customer Private Feedback</h4>
                    <div className="bg-surface/50 p-6 rounded-2xl border border-outline-variant/10 mb-8">
                      <p className="text-[15px] leading-relaxed text-on-surface font-medium italic">
                        {selectedFeedback.feedbackMessage ? `"${selectedFeedback.feedbackMessage}"` : 'No detailed comment written.'}
                      </p>
                    </div>

                    {selectedFeedback.replyMessage && (
                      <>
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-outline mb-4">Your Private Response</h4>
                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                          <p className="text-[15px] leading-relaxed text-on-surface font-medium">
                            "{selectedFeedback.replyMessage}"
                          </p>
                          <p className="text-[10px] text-outline mt-3">
                            Sent at: {selectedFeedback.repliedAt ? new Date(selectedFeedback.repliedAt).toLocaleString() : ''}
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
                      placeholder={selectedFeedback.feedbackEmail ? "Write your professional response here..." : "Cannot reply directly (no email provided)"}
                      rows={3}
                      value={replyText}
                      disabled={!selectedFeedback.feedbackEmail || isSubmitting}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button 
                        onClick={handleSendReply}
                        disabled={!selectedFeedback.feedbackEmail || !replyText.trim() || isSubmitting}
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
                      
                      {selectedFeedback.status !== 'resolved' && (
                        <button 
                          onClick={() => handleMarkStatus(selectedFeedback.id, 'resolved')}
                          className="flex-1 sm:flex-none bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all active:scale-95 border border-outline-variant/10"
                        >
                          Mark as Resolved
                        </button>
                      )}

                      {selectedFeedback.status === 'resolved' && (
                        <button 
                          onClick={() => handleMarkStatus(selectedFeedback.id, 'pending')}
                          className="flex-1 sm:flex-none bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all active:scale-95 border border-outline-variant/10"
                        >
                          Reopen Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
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
