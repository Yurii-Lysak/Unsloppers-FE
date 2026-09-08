import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  resourcingAssignedListQueryKey,
  resourcingDetailQueryKey,
  resourcingListQueryKey,
} from '@/api/hooks/useResourcing'
import { resourcingApiService } from '@/api/services/resourcing.service'
import type {
  CreateResourcingProposalInput,
  CreateResourcingRequestInput,
} from '@/types/resourcing'

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

export const useCreateResourcingProposal = (requestId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateResourcingProposalInput) =>
      resourcingApiService.createProposal(requestId, input),
    onSuccess: async () => {
      toast.success(t('resourcing.detail.proposal.create.success'))
      await queryClient.invalidateQueries({
        queryKey: resourcingDetailQueryKey(requestId),
      })
    },
    onError: () => {
      toast.error(t('resourcing.detail.proposal.create.error'))
    },
  })
}

export const useSubmitResourcingRequest = (requestId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => resourcingApiService.submitRequest(requestId),
    onSuccess: async () => {
      toast.success(t('resourcing.detail.submitToast.success'))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: resourcingDetailQueryKey(requestId) }),
        queryClient.invalidateQueries({ queryKey: resourcingAssignedListQueryKey }),
      ])
    },
    onError: () => {
      toast.error(t('resourcing.detail.submitToast.error'))
    },
  })
}
