import { useQuery } from '@tanstack/react-query'
import { mentorshipApiService } from '@/api/services/mentorship.service'
import type { MentorshipPairListFilter } from '@/types/mentorship'

export const willingMentorsQueryKey = ['mentorship', 'willing-mentors'] as const
export const assignableMenteesQueryKey = ['mentorship', 'assignable-mentees'] as const
export const mentorshipPairsQueryKey = (status: MentorshipPairListFilter = 'all') =>
  ['mentorship', 'pairs', status] as const

/** @deprecated Use mentorshipPairsQueryKey('active') */
export const activeMentorshipPairsQueryKey = mentorshipPairsQueryKey('active')

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

export const useMentorshipPairs = (
  status: MentorshipPairListFilter = 'all',
  enabled = true,
) =>
  useQuery({
    queryKey: mentorshipPairsQueryKey(status),
    queryFn: () => mentorshipApiService.getPairs(status),
    enabled,
  })

/** @deprecated Use useMentorshipPairs */
export const useActiveMentorshipPairs = (enabled = true) =>
  useMentorshipPairs('active', enabled)
