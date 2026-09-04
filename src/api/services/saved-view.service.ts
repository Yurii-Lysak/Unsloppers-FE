import { apiClient } from '@/api/client'
import type {
  CreateSavedViewInput,
  SavedView,
  ShareSavedViewInput,
  UpdateSavedViewInput,
} from '@/types/saved-views'

class SavedViewApiService {
  public listSavedViews(): Promise<SavedView[]> {
    return apiClient.get<SavedView[]>('/api/v1/saved-views')
  }

  public createSavedView(input: CreateSavedViewInput): Promise<SavedView> {
    return apiClient.post<SavedView>('/api/v1/saved-views', input)
  }

  public updateSavedView(
    viewId: string,
    input: UpdateSavedViewInput,
  ): Promise<SavedView> {
    return apiClient.patch<SavedView>(`/api/v1/saved-views/${viewId}`, input)
  }

  public deleteSavedView(viewId: string): Promise<{ deleted: true }> {
    return apiClient.delete<{ deleted: true }>(`/api/v1/saved-views/${viewId}`)
  }

  public replaceSavedViewShares(
    viewId: string,
    input: ShareSavedViewInput,
  ): Promise<SavedView> {
    return apiClient.put<SavedView>(
      `/api/v1/saved-views/${viewId}/shares`,
      input,
    )
  }
}

export const savedViewApiService = new SavedViewApiService()
