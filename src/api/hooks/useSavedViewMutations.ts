import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { savedViewApiService } from '@/api/services/saved-view.service'
import { savedViewsListQueryKey } from '@/api/hooks/useSavedViews'
import type {
  CreateSavedViewInput,
  ShareSavedViewInput,
  UpdateSavedViewInput,
} from '@/types/saved-views'

export const useCreateSavedView = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateSavedViewInput) =>
      savedViewApiService.createSavedView(input),
    onSuccess: async () => {
      toast.success(t('directory.savedViews.createSuccess'))
      await queryClient.invalidateQueries({ queryKey: savedViewsListQueryKey })
    },
    onError: () => {
      toast.error(t('directory.savedViews.createFailed'))
    },
  })
}

export const useUpdateSavedView = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      viewId,
      input,
    }: {
      viewId: string
      input: UpdateSavedViewInput
    }) => savedViewApiService.updateSavedView(viewId, input),
    onSuccess: async () => {
      toast.success(t('directory.savedViews.updateSuccess'))
      await queryClient.invalidateQueries({ queryKey: savedViewsListQueryKey })
    },
    onError: () => {
      toast.error(t('directory.savedViews.updateFailed'))
    },
  })
}

export const useDeleteSavedView = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (viewId: string) => savedViewApiService.deleteSavedView(viewId),
    onSuccess: async () => {
      toast.success(t('directory.savedViews.deleteSuccess'))
      await queryClient.invalidateQueries({ queryKey: savedViewsListQueryKey })
    },
    onError: () => {
      toast.error(t('directory.savedViews.deleteFailed'))
    },
  })
}

export const useShareSavedView = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      viewId,
      input,
    }: {
      viewId: string
      input: ShareSavedViewInput
    }) => savedViewApiService.replaceSavedViewShares(viewId, input),
    onSuccess: async () => {
      toast.success(t('directory.savedViews.shareSuccess'))
      await queryClient.invalidateQueries({ queryKey: savedViewsListQueryKey })
    },
    onError: () => {
      toast.error(t('directory.savedViews.shareFailed'))
    },
  })
}
