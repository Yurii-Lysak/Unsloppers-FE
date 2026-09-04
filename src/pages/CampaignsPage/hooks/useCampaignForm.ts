import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCampaignMutations } from '@/hooks/data/useCampaignsData'
import type { Campaign } from '@/types/campaigns'
import {
  createCampaignFormSchema,
  type CampaignFormValues,
} from '../schemas/campaign-form.schema'

interface UseCampaignFormOptions {
  campaign?: Campaign
  onSaved: () => void
}

export const useCampaignForm = ({ campaign, onSaved }: UseCampaignFormOptions) => {
  const { t } = useTranslation()
  const { createCampaign, updateCampaign, isSavingCampaign, resetMutationState } =
    useCampaignMutations()

  const defaultValues = useMemo<CampaignFormValues>(
    () => ({
      title: campaign?.title ?? '',
      description: campaign?.description ?? '',
      purpose: campaign?.purpose ?? '',
      link: campaign?.link ?? '',
      dueDate: campaign?.dueDate ?? '',
    }),
    [campaign],
  )

  const { schema } = useMemo(() => createCampaignFormSchema(t), [t])

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  const onSubmit = async (values: CampaignFormValues) => {
    if (campaign) {
      await updateCampaign(campaign.id, values)
    } else {
      await createCampaign(values)
    }
    onSaved()
  }

  return {
    form,
    onSubmit,
    isSubmitting: isSavingCampaign,
    isEditing: Boolean(campaign),
    resetMutationState,
  }
}
