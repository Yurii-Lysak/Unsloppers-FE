import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { savedViewApiService } from '@/api/services/saved-view.service'

export const savedViewsListQueryKey = ['saved-views', 'list'] as const

export const useSavedViewsList = () =>
  useQuery({
    queryKey: savedViewsListQueryKey,
    queryFn: () => savedViewApiService.listSavedViews(),
    retry: (_, error) => {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        return false
      }
      return true
    },
  })
