export type ResourcingRequestStatus = 'open'

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
