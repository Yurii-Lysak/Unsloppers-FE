export type ResourcingRequestStatus = 'open' | 'pending_dm_review'

export interface ResourcingRequestAuthor {
  id: string
  displayName: string
}

export interface ResourcingRequest {
  id: string
  vacancyDetails: string
  expectedCompBand?: string
  duration: string
  workload: string
  headcount: number
  department: string
  projectId?: string | null
  status: ResourcingRequestStatus
  author: ResourcingRequestAuthor
  createdAt: string
  updatedAt: string
}

export interface CreateResourcingRequestInput {
  vacancyDetails: string
  expectedCompBand: string
  duration: string
  workload: string
  headcount?: number
  department: string
  projectId?: string | null
}

/** Story 6.2 — one attached candidate (internal or external-link) on a request. */
export interface ResourcingProposal {
  id: string
  requestId: string
  proposedById: string
  candidateEmployeeId?: string | null
  candidateDisplayName?: string
  peopleForceCandidateId?: string | null
  peopleForceCandidateUrl?: string | null
  status: 'proposed'
  createdAt: string
}

export interface ResourcingCandidatePoolEntry {
  id: string
  displayName: string
}

/** `GET /resourcing/requests/:id` — 6.1 read shape plus fulfilment data. */
export interface ResourcingRequestDetail extends ResourcingRequest {
  proposals: ResourcingProposal[]
  reviewingDmId?: string | null
  candidatePool?: ResourcingCandidatePoolEntry[]
}

/** Exactly one of `candidateEmployeeId` (internal) or `peopleForceCandidateUrl` (external). */
export interface CreateResourcingProposalInput {
  candidateEmployeeId?: string
  peopleForceCandidateId?: string
  peopleForceCandidateUrl?: string
}
