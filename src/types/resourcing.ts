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

/** Story 6.3 — `proposed` transitions to `approved`/`rejected`; `rejected` is terminal. */
export type ResourcingProposalStatus = 'proposed' | 'approved' | 'rejected'

/** Story 6.2 — one attached candidate (internal or external-link) on a request. */
export interface ResourcingProposal {
  id: string
  requestId: string
  proposedById: string
  candidateEmployeeId?: string | null
  candidateDisplayName?: string
  peopleForceCandidateId?: string | null
  peopleForceCandidateUrl?: string | null
  status: ResourcingProposalStatus
  /** Set when rejected (from proposed) or reversed (from approved); null otherwise. */
  decisionReason?: string | null
  /**
   * Story 6.3 — the internal candidate's existing shared-link token (created
   * at 6.2 submit), populated only when the viewer is the reviewing DM; null
   * when no live link exists or the candidate is external.
   */
  sharedLinkToken?: string | null
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
  /** Live count of this request's currently `approved` proposals. */
  approvedCount: number
  /**
   * Server-computed `viewerEmployeeId === reviewingDmId` — the frontend has
   * no other way to know its own viewerEmployeeId to make that comparison.
   */
  viewerIsReviewingDm: boolean
}

/** Exactly one of `candidateEmployeeId` (internal) or `peopleForceCandidateUrl` (external). */
export interface CreateResourcingProposalInput {
  candidateEmployeeId?: string
  peopleForceCandidateId?: string
  peopleForceCandidateUrl?: string
}

/**
 * Story 6.3 — `POST /resourcing/requests/:id/proposals/:proposalId/decide`.
 * `reason` is required by the backend when rejecting a `proposed` row or
 * reversing an `approved` row to `rejected`.
 */
export interface DecideResourcingProposalInput {
  decision: 'approved' | 'rejected'
  reason?: string
}
