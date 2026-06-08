import { apiClient } from "@/lib/api-client";
import { CampaignConfig } from "@/app/dashboard/campaigns/[id]/types";
import { mapConfigToDto } from "@/app/dashboard/campaigns/[id]/mappers";

export interface CampaignResponse {
  id: string;
  slug: string;
  businessName: string;
  logoUrl?: string;
  createdAt: string;
  isActive: boolean;
  placement?: string;
  stats: {
    totalScans: number;
    positiveScans: number;
    negativeScans: number;
  };
}

export const CampaignService = {
  /**
   * Fetches all campaigns for the authenticated user
   */
  async getMyCampaigns(token: string) {
    return apiClient<CampaignResponse[]>('/campaigns', { token });
  },

  /**
   * Fetches a single campaign by ID
   */
  async getCampaignById(id: string, token: string) {
    return apiClient<Record<string, unknown>>(`/campaigns/${id}`, { token });
  },

  /**
   * Creates a new campaign from the UI configuration
   */
  async createCampaign(config: CampaignConfig, token: string) {
    const dto = mapConfigToDto(config);
    return apiClient<CampaignResponse>('/campaigns', {
      method: 'POST',
      token,
      body: JSON.stringify(dto),
    });
  },

  /**
   * Updates an existing campaign
   */
  async updateCampaign(id: string, config: CampaignConfig, token: string) {
    const dto = mapConfigToDto(config);
    return apiClient<CampaignResponse>(`/campaigns/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(dto),
    });
  },

  /**
   * Deletes a campaign
   */
  async deleteCampaign(id: string, token: string) {
    return apiClient<void>(`/campaigns/${id}`, {
      method: 'DELETE',
      token,
    });
  },

  /**
   * Fetches campaign stats
   */
  async getCampaignStats(id: string, token: string) {
    return apiClient<Record<string, unknown>>(`/campaigns/${id}/stats`, { token });
  }
};
