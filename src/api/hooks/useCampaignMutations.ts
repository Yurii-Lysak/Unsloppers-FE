import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { campaignQueryKey, campaignsListQueryKey, campaignAudiencePreviewQueryKey } from '@/api/hooks/useCampaigns'
import { campaignApiService } from '@/api/services/campaign.service'
import type { CreateCampaignInput, UpdateCampaignInput } from '@/types/campaigns'
import type { CampaignAudienceDefinition } from '@/types/campaigns'

export const useCreateCampaign = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCampaignInput) =>
      campaignApiService.createCampaign(input),
    onSuccess: async () => {
      toast.success(t('campaigns.create.success'))
      await queryClient.invalidateQueries({ queryKey: campaignsListQueryKey })
    },
    onError: () => {
      toast.error(t('campaigns.saveFailed'))
    },
  })
}

export const useUpdateCampaign = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCampaignInput }) =>
      campaignApiService.updateCampaign(id, input),
    onSuccess: async (_data, variables) => {
      toast.success(t('campaigns.update.success'))
      await queryClient.invalidateQueries({ queryKey: campaignsListQueryKey })
      await queryClient.invalidateQueries({
        queryKey: campaignQueryKey(variables.id),
      })
    },
    onError: () => {
      toast.error(t('campaigns.saveFailed'))
    },
  })
}

export const useSaveCampaignAudience = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      campaignId,
      audience,
    }: {
      campaignId: string
      audience: CampaignAudienceDefinition
    }) => campaignApiService.saveCampaignAudience(campaignId, audience),
    onSuccess: async (_data, variables) => {
      toast.success(t('campaigns.audience.saveSuccess'))
      await queryClient.invalidateQueries({
        queryKey: campaignQueryKey(variables.campaignId),
      })
      await queryClient.invalidateQueries({
        queryKey: campaignAudiencePreviewQueryKey(variables.campaignId),
      })
    },
    onError: () => {
      toast.error(t('campaigns.saveFailed'))
    },
  })
}

export const useActivateCampaign = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaignId: string) =>
      campaignApiService.activateCampaign(campaignId),
    onSuccess: async (_data, campaignId) => {
      toast.success(t('campaigns.activate.success'))
      await queryClient.invalidateQueries({ queryKey: campaignsListQueryKey })
      await queryClient.invalidateQueries({
        queryKey: campaignQueryKey(campaignId),
      })
      await queryClient.invalidateQueries({
        queryKey: campaignAudiencePreviewQueryKey(campaignId),
      })
    },
    onError: async (error, campaignId) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const body = error.response?.data as
          | { invalidAssigneeIds?: unknown }
          | undefined
        const invalidAssigneeIds = body?.invalidAssigneeIds

        if (
          status === 400 &&
          Array.isArray(invalidAssigneeIds) &&
          invalidAssigneeIds.length > 0
        ) {
          toast.error(
            t('campaigns.activate.invalidAssignees', {
              count: invalidAssigneeIds.length,
            }),
          )
        } else {
          toast.error(t('campaigns.saveFailed'))
        }

        if (status === 409 || status === 404) {
          await queryClient.invalidateQueries({
            queryKey: campaignQueryKey(campaignId),
          })
        }
      } else {
        toast.error(t('campaigns.saveFailed'))
      }
    },
  })
}
