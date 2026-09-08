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
