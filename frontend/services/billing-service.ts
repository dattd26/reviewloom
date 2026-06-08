import { apiClient } from "@/lib/api-client";

export interface BillingHistoryItem {
  date: string;
  amount: string;
  status: string;
}

export interface SubscriptionOverviewResponse {
  planName: string;
  status: string;
  renewsAt?: string;
  campaignsUsed: number;
  campaignsLimit: number;
  cardBrand?: string;
  cardLast4?: string;
  billingHistory: BillingHistoryItem[];
}

export const BillingService = {
  async getSubscriptionOverview(token: string) {
    return apiClient<SubscriptionOverviewResponse>('/billing/subscription', { token });
  },
  async createPortalSession(token: string) {
    return apiClient<{ url: string }>('/billing/create-portal-session', { method: 'POST', token });
  },
  async createCheckoutSession(token: string, planId: 'monthly' | 'yearly') {
    return apiClient<{ url: string }>('/billing/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ planId }),
      token,
    });
  }
};
