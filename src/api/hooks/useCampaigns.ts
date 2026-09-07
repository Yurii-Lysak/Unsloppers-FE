import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { LIVE_REFRESH_INTERVAL_MS } from '@/api/polling'
import { campaignApiService } from '@/api/services/campaign.service'

export const campaignsListQueryKey = ['campaigns', 'list'] as const
export const campaignQueryKey = (campaignId: string) =>
  ['campaigns', campaignId] as const

export const campaignAudiencePreviewQueryKey = (campaignId: string) =>
  ['campaigns', campaignId, 'audience-preview'] as const

export const campaignCompletionQueryKey = (campaignId: string) =>
  ['campaigns', campaignId, 'completion'] as const

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

export const useCampaignCompletion = (
  campaignId: string,
  enabled = false,
) =>
  useQuery({
    queryKey: campaignCompletionQueryKey(campaignId),
    queryFn: () => campaignApiService.getCampaignCompletion(campaignId),
    enabled,
    refetchInterval: query => {
      if (!enabled) {
        return false
      }
      const error = query.state.error
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 404 || status === 409) {
          return false
        }
      }
      return LIVE_REFRESH_INTERVAL_MS
    },
  })
