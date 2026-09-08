import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { resourcingListQueryKey } from '@/api/hooks/useResourcing'
import { resourcingApiService } from '@/api/services/resourcing.service'
import type { CreateResourcingRequestInput } from '@/types/resourcing'

export const useCreateResourcingRequest = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateResourcingRequestInput) =>
      resourcingApiService.createRequest(input),
    onSuccess: async () => {
      toast.success(t('resourcing.create.success'))
      await queryClient.invalidateQueries({ queryKey: resourcingListQueryKey })
    },
    onError: () => {
      toast.error(t('resourcing.saveFailed'))
    },
  })
}
