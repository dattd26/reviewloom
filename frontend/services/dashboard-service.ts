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

export interface DashboardDateRange {
  fromDate: string;
  toDate: string;
}

export const DashboardService = {
  async getOverview(token: string, dateRange?: DashboardDateRange) {
    const params = new URLSearchParams();

    if (dateRange?.fromDate) params.set('fromDate', dateRange.fromDate);
    if (dateRange?.toDate) params.set('toDate', dateRange.toDate);

    const query = params.toString();
    return apiClient<DashboardOverviewResponse>(`/dashboard/overview${query ? `?${query}` : ''}`, { token });
  }
};
