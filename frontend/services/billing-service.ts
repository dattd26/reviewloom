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
  }
};
