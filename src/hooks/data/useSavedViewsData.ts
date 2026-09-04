import { useSavedViewsList } from '@/api/hooks/useSavedViews'
import {
  useCreateSavedView,
  useDeleteSavedView,
  useShareSavedView,
  useUpdateSavedView,
} from '@/api/hooks/useSavedViewMutations'
import type {
  CreateSavedViewInput,
  ShareSavedViewInput,
  UpdateSavedViewInput,
} from '@/types/saved-views'

export const useSavedViewsData = () => {
  const {
    data: savedViews,
    isLoading: isSavedViewsLoading,
    isError: isSavedViewsError,
  } = useSavedViewsList()

  const createMutation = useCreateSavedView()
  const updateMutation = useUpdateSavedView()
  const deleteMutation = useDeleteSavedView()
  const shareMutation = useShareSavedView()

  const createSavedView = async (input: CreateSavedViewInput) =>
    createMutation.mutateAsync(input)

  const updateSavedView = async (viewId: string, input: UpdateSavedViewInput) =>
    updateMutation.mutateAsync({ viewId, input })

  const deleteSavedView = async (viewId: string) =>
    deleteMutation.mutateAsync(viewId)

  const shareSavedView = async (viewId: string, input: ShareSavedViewInput) =>
    shareMutation.mutateAsync({ viewId, input })

  return {
    savedViews,
    isSavedViewsLoading,
    isSavedViewsError,
    createSavedView,
    updateSavedView,
    deleteSavedView,
    shareSavedView,
    isCreatingSavedView: createMutation.isPending,
    isUpdatingSavedView: updateMutation.isPending,
    isDeletingSavedView: deleteMutation.isPending,
    isSharingSavedView: shareMutation.isPending,
  }
}
