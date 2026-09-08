import { apiClient } from '@/api/client'
import type {
  MentorshipSection,
  PatchOpenToMentoringPayload,
} from '@/types/employee-profile'
import type {
  AssignableMenteesResponse,
  CreateMentorshipPairInput,
  CreatedMentorshipPair,
  WillingMentorsResponse,
} from '@/types/mentorship'

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

  public getWillingMentors(): Promise<WillingMentorsResponse> {
    return apiClient.get<WillingMentorsResponse>('/api/v1/mentorship/willing-mentors')
  }

  public getAssignableMentees(): Promise<AssignableMenteesResponse> {
    return apiClient.get<AssignableMenteesResponse>(
      '/api/v1/mentorship/assignable-mentees',
    )
  }

  public createPair(input: CreateMentorshipPairInput): Promise<CreatedMentorshipPair> {
    return apiClient.post<CreatedMentorshipPair>('/api/v1/mentorship/pairs', input)
  }
}

export const mentorshipApiService = new MentorshipApiService()
