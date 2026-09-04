import { useCampaign, useCampaignsList, useCampaignAudiencePreview } from '@/api/hooks/useCampaigns'
import { useCreateCampaign, useUpdateCampaign, useSaveCampaignAudience } from '@/api/hooks/useCampaignMutations'
import type { CreateCampaignInput, UpdateCampaignInput, CampaignAudienceDefinition } from '@/types/campaigns'

export const useCampaignsListData = (enabled = true) => {
  const {
    data: campaignsList,
    isLoading: isCampaignsLoading,
    isError: isCampaignsError,
  } = useCampaignsList(enabled)

  return {
    campaignsList,
    isCampaignsLoading,
    isCampaignsError,
  }
}

export const useCampaignData = (campaignId: string, enabled = true) => {
  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isError: isCampaignError,
  } = useCampaign(campaignId, enabled)

  return {
    campaign,
    isCampaignLoading,
    isCampaignError,
  }
}

export const useCampaignMutations = () => {
  const createCampaignMutation = useCreateCampaign()
  const updateCampaignMutation = useUpdateCampaign()

  const createCampaign = async (input: CreateCampaignInput) => {
    await createCampaignMutation.mutateAsync(input)
  }

  const updateCampaign = async (id: string, input: UpdateCampaignInput) => {
    await updateCampaignMutation.mutateAsync({ id, input })
  }

  const resetMutationState = () => {
    createCampaignMutation.reset()
    updateCampaignMutation.reset()
  }

  return {
    createCampaign,
    updateCampaign,
    isSavingCampaign:
      createCampaignMutation.isPending || updateCampaignMutation.isPending,
    resetMutationState,
  }
}

export const useCampaignAudiencePreviewData = (
  campaignId: string,
  page = 1,
  pageSize = 50,
  enabled = true,
) => {
  const {
    data: audiencePreview,
    isLoading: isAudiencePreviewLoading,
    isError: isAudiencePreviewError,
    refetch: refetchAudiencePreview,
  } = useCampaignAudiencePreview(campaignId, page, pageSize, enabled)

  return {
    audiencePreview,
    isAudiencePreviewLoading,
    isAudiencePreviewError,
    refetchAudiencePreview,
  }
}

export const useSaveCampaignAudienceData = () => {
  const saveAudienceMutation = useSaveCampaignAudience()

  const saveCampaignAudience = async (
    campaignId: string,
    audience: CampaignAudienceDefinition,
  ) => {
    await saveAudienceMutation.mutateAsync({ campaignId, audience })
  }

  return {
    saveCampaignAudience,
    isSavingCampaignAudience: saveAudienceMutation.isPending,
  }
}
