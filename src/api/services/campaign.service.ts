import { apiClient } from '@/api/client'
import type {
  Campaign,
  CreateCampaignInput,
  UpdateCampaignInput,
} from '@/types/campaigns'

class CampaignApiService {
  public getCampaignsList = (): Promise<Campaign[]> =>
    apiClient.get<Campaign[]>('/api/v1/campaigns')

  public getCampaign(campaignId: string): Promise<Campaign> {
    return apiClient.get<Campaign>(`/api/v1/campaigns/${campaignId}`)
  }

  public createCampaign(input: CreateCampaignInput): Promise<Campaign> {
    return apiClient.post<Campaign>('/api/v1/campaigns', input)
  }

  public updateCampaign(id: string, input: UpdateCampaignInput): Promise<Campaign> {
    return apiClient.patch<Campaign>(`/api/v1/campaigns/${id}`, input)
  }
}

export const campaignApiService = new CampaignApiService()
