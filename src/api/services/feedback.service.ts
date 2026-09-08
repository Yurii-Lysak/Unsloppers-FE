import { apiClient } from '@/api/client'
import type {
  CreateFeedbackRecordPayload,
  FeedbackRecord,
  FeedbackSection,
  UpdateFeedbackRecordPayload,
} from '@/types/employee-profile'

class FeedbackApiService {
  public getFeedbacks(employeeId: string): Promise<FeedbackSection> {
    return apiClient.get<FeedbackSection>(
      `/api/v1/employees/${employeeId}/feedbacks`,
    )
  }

  public createFeedback(
    employeeId: string,
    payload: CreateFeedbackRecordPayload,
  ): Promise<FeedbackRecord> {
    return apiClient.post<FeedbackRecord>(
      `/api/v1/employees/${employeeId}/feedbacks`,
      payload,
    )
  }

  public updateFeedback(
    employeeId: string,
    feedbackId: string,
    payload: UpdateFeedbackRecordPayload,
  ): Promise<FeedbackRecord> {
    return apiClient.patch<FeedbackRecord>(
      `/api/v1/employees/${employeeId}/feedbacks/${feedbackId}`,
      payload,
    )
  }

  public deleteFeedback(employeeId: string, feedbackId: string): Promise<void> {
    return apiClient.delete<void>(
      `/api/v1/employees/${employeeId}/feedbacks/${feedbackId}`,
    )
  }
}

export const feedbackApiService = new FeedbackApiService()
