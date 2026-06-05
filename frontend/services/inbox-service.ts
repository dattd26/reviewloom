import { apiClient } from "@/lib/api-client";

export interface PrivateFeedback {
  id: string;
  campaignId: string;
  campaignBusinessName: string;
  rating: number;
  feedbackName?: string;
  feedbackEmail?: string;
  feedbackMessage?: string;
  scannedAt: string;
  status: 'unread' | 'pending' | 'resolved';
  replyMessage?: string;
  repliedAt?: string;
}

export const InboxService = {
  async getFeedbackList(
    token: string,
    params: { campaignId?: string; status?: string; search?: string } = {}
  ) {
    const queryParts: string[] = [];
    if (params.campaignId) queryParts.push(`campaignId=${params.campaignId}`);
    if (params.status) queryParts.push(`status=${params.status}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);

    const query = queryParts.length ? `?${queryParts.join('&')}` : '';
    return apiClient<PrivateFeedback[]>(`/inbox${query}`, { token });
  },

  async updateStatus(token: string, id: string, status: 'unread' | 'pending' | 'resolved') {
    return apiClient<void>(`/inbox/${id}/status`, {
      method: 'PUT',
      token,
      body: JSON.stringify({ status })
    });
  },

  async sendReply(token: string, id: string, replyMessage: string) {
    return apiClient<void>(`/inbox/${id}/reply`, {
      method: 'POST',
      token,
      body: JSON.stringify({ replyMessage })
    });
  }
};
