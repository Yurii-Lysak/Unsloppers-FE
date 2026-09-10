import { apiClient } from '@/api/client'
import type { ActionItem } from '@/types/employee-profile'

class ActionItemApiService {
  public completeActionItem(
    employeeId: string,
    itemId: string,
  ): Promise<ActionItem> {
    return apiClient.post<ActionItem>(
      `/api/v1/employees/${employeeId}/action-items/${itemId}/complete`,
    )
  }
}

export const actionItemApiService = new ActionItemApiService()
