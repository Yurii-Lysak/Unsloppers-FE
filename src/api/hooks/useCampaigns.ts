import { useQuery } from '@tanstack/react-query'
import { campaignApiService } from '@/api/services/campaign.service'

export const campaignsListQueryKey = ['campaigns', 'list'] as const
export const campaignQueryKey = (campaignId: string) =>
  ['campaigns', campaignId] as const

export const campaignAudiencePreviewQueryKey = (campaignId: string) =>
  ['campaigns', campaignId, 'audience-preview'] as const

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

export const useCampaignAudiencePreview = (
  campaignId: string,
  page = 1,
  pageSize = 50,
  enabled = true,
) =>
  useQuery({
    queryKey: [...campaignAudiencePreviewQueryKey(campaignId), page, pageSize],
    queryFn: () => campaignApiService.previewCampaignAudience(campaignId, page, pageSize),
    enabled,
  })
