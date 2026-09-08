import { useQuery } from '@tanstack/react-query'
import { mentorshipApiService } from '@/api/services/mentorship.service'

export const willingMentorsQueryKey = ['mentorship', 'willing-mentors'] as const
export const assignableMenteesQueryKey = ['mentorship', 'assignable-mentees'] as const

export const useWillingMentors = (enabled = true) =>
  useQuery({
    queryKey: willingMentorsQueryKey,
    queryFn: mentorshipApiService.getWillingMentors,
    enabled,
  })

export const useAssignableMentees = (enabled = true) =>
  useQuery({
    queryKey: assignableMenteesQueryKey,
    queryFn: mentorshipApiService.getAssignableMentees,
    enabled,
  })
