import { apiClient } from "@/lib/api-client";
import { StandeeTemplate } from "@/types/campaign";

export const StandeeTemplateService = {
  /**
   * Fetches all standee templates from the backend
   */
  async getTemplates(token: string): Promise<StandeeTemplate[]> {
    return apiClient<StandeeTemplate[]>('/standeeTemplates', { token });
  }
};
