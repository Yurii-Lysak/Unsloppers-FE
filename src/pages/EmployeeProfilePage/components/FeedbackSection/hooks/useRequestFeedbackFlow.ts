import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { campaignsListQueryKey } from '@/hooks/data/useCampaignsData'
import { campaignApiService } from '@/api/services/campaign.service'
import type { RequestFeedbackFormValues } from '../schemas/request-feedback.schema'

export const useRequestFeedbackFlow = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitRequestFeedback = useCallback(
    async (values: RequestFeedbackFormValues): Promise<boolean> => {
      setIsSubmitting(true)
      const uniqueColleagueIds = [...new Set(values.colleagueIds)]

      try {
        const campaign = await campaignApiService.createCampaign({
          title: values.title,
          description: values.description,
          purpose: values.purpose,
          link: values.link,
          dueDate: values.dueDate,
        })

        try {
          await campaignApiService.saveCampaignAudience(campaign.id, {
            filters: [],
            addedEmployeeIds: uniqueColleagueIds,
            excludedEmployeeIds: [],
          })
          await queryClient.invalidateQueries({ queryKey: campaignsListQueryKey })
          toast.success(t('employeeProfile.s8.requestFeedback.success'))
        } catch {
          toast.error(t('employeeProfile.s8.requestFeedback.error'))
          await queryClient.invalidateQueries({ queryKey: campaignsListQueryKey })
        }

        navigate(`/campaigns/${campaign.id}`)
        return true
      } catch {
        toast.error(t('employeeProfile.s8.requestFeedback.error'))
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [navigate, queryClient, t],
  )

  return {
    submitRequestFeedback,
    isSubmitting,
  }
}
