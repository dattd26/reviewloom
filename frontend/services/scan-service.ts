import { apiClient } from "@/lib/api-client";

export interface LogScanData {
  rating: number;
  action: 'positive' | 'negative';
  feedbackName?: string;
  feedbackEmail?: string;
  feedbackMessage?: string;
}

export const ScanService = {
  /**
   * Logs a scan event for a campaign
   */
  async logScan(slug: string, data: LogScanData) {
    return apiClient<{ message: string }>(`/r/${slug}/scan`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
