export interface WillingMentor {
  id: string
  displayName: string
  openToMentoring: true
}

export interface WillingMentorsResponse {
  mentors: WillingMentor[]
}

export interface AssignableMentee {
  id: string
  displayName: string
}

export interface AssignableMenteesResponse {
  mentees: AssignableMentee[]
}

export interface CreateMentorshipPairInput {
  mentorId: string
  menteeId: string
}

export interface CreatedMentorshipPair {
  id: string
  mentorId: string
  menteeId: string
  startedAt: string
  mentorStatus: 'mentor' | 'openToMentoring' | 'none'
}

export interface ActiveMentorshipPair {
  id: string
  mentorId: string
  mentorDisplayName: string
  menteeId: string
  menteeDisplayName: string
  startedAt: string
  endedAt: string | null
  status: 'active' | 'ended'
}

export type MentorshipPairListFilter = 'active' | 'ended' | 'all'

export interface ActiveMentorshipPairsResponse {
  pairs: ActiveMentorshipPair[]
}

export interface EndMentorshipPairInput {
  closureFeedback: string
}

export interface EndedMentorshipPair {
  id: string
  mentorId: string
  menteeId: string
  startedAt: string
  endedAt: string
  closureFeedback: string
  mentorStatus: 'mentor' | 'openToMentoring' | 'none'
}
