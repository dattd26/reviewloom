import { apiClient } from "@/lib/api-client";

export interface ScanGrowthRecord {
  date: string;
  total: number;
  positive: number;
  negative: number;
}

export interface RecentActivityRecord {
  id: string;
  campaignBusinessName: string;
  action: 'positive' | 'negative';
  rating: number;
  feedbackName?: string;
  feedbackMessage?: string;
  scannedAt: string;
}

export interface DashboardOverviewResponse {
  totalScans: number;
  positivePercentage: number;
  newPrivateFeedback: number;
  scansGrowth: ScanGrowthRecord[];
  recentActivity: RecentActivityRecord[];
}

export const DashboardService = {
  async getOverview(token: string) {
    return apiClient<DashboardOverviewResponse>('/dashboard/overview', { token });
  }
};
