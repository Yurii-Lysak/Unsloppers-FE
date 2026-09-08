import { apiClient } from '@/api/client'
import type {
  MentorshipSection,
  PatchOpenToMentoringPayload,
} from '@/types/employee-profile'

class MentorshipApiService {
  public patchOpenToMentoring(
    employeeId: string,
    payload: PatchOpenToMentoringPayload,
  ): Promise<MentorshipSection> {
    return apiClient.patch<MentorshipSection>(
      `/api/v1/employees/${employeeId}/mentorship/open-to-mentoring`,
      payload,
    )
  }
}

export const mentorshipApiService = new MentorshipApiService()
