import { useQuery } from '@tanstack/react-query'
import { campaignApiService } from '@/api/services/campaign.service'

export const campaignsListQueryKey = ['campaigns', 'list'] as const
export const campaignQueryKey = (campaignId: string) =>
  ['campaigns', campaignId] as const

export const useCampaignsList = (enabled = true) =>
  useQuery({
    queryKey: campaignsListQueryKey,
    queryFn: campaignApiService.getCampaignsList,
    enabled,
  })

export const useCampaign = (campaignId: string, enabled = true) =>
  useQuery({
    queryKey: campaignQueryKey(campaignId),
    queryFn: () => campaignApiService.getCampaign(campaignId),
    enabled,
  })
