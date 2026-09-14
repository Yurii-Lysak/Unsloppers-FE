import { apiClient } from '@/api/client'
import type {
  CreateTimelineEventPayload,
  TimelineEvent,
  UpdateTimelineEventPayload,
} from '@/types/employee-profile'

class TimelineApiService {
  public createEvent(
    employeeId: string,
    payload: CreateTimelineEventPayload,
  ): Promise<TimelineEvent> {
    return apiClient.post<TimelineEvent>(
      `/api/v1/employees/${employeeId}/timeline`,
      payload,
    )
  }

  public updateEvent(
    employeeId: string,
    eventId: string,
    payload: UpdateTimelineEventPayload,
  ): Promise<TimelineEvent> {
    return apiClient.patch<TimelineEvent>(
      `/api/v1/employees/${employeeId}/timeline/${eventId}`,
      payload,
    )
  }

  public deleteEvent(employeeId: string, eventId: string): Promise<void> {
    return apiClient.delete<void>(
      `/api/v1/employees/${employeeId}/timeline/${eventId}`,
    )
  }
}

export const timelineApiService = new TimelineApiService()
