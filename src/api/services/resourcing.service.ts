import { apiClient } from '@/api/client'
import type {
  CreateResourcingProposalInput,
  CreateResourcingRequestInput,
  DecideResourcingProposalInput,
  ResourcingProposal,
  ResourcingRequest,
  ResourcingRequestDetail,
} from '@/types/resourcing'

class ResourcingApiService {
  public getRequestsList = (): Promise<ResourcingRequest[]> =>
    apiClient.get<ResourcingRequest[]>('/api/v1/resourcing/requests')

  public createRequest(input: CreateResourcingRequestInput): Promise<ResourcingRequest> {
    return apiClient.post<ResourcingRequest>('/api/v1/resourcing/requests', input)
  }

  public getAssignedRequestsList = (): Promise<ResourcingRequest[]> =>
    apiClient.get<ResourcingRequest[]>('/api/v1/resourcing/requests/assigned')

  public getPendingReviewRequestsList = (): Promise<ResourcingRequest[]> =>
    apiClient.get<ResourcingRequest[]>('/api/v1/resourcing/requests/pending-review')

  public getRequestDetail(requestId: string): Promise<ResourcingRequestDetail> {
    return apiClient.get<ResourcingRequestDetail>(
      `/api/v1/resourcing/requests/${requestId}`,
    )
  }

  public createProposal(
    requestId: string,
    input: CreateResourcingProposalInput,
  ): Promise<ResourcingProposal> {
    return apiClient.post<ResourcingProposal>(
      `/api/v1/resourcing/requests/${requestId}/proposals`,
      input,
    )
  }

  public submitRequest(requestId: string): Promise<ResourcingRequestDetail> {
    return apiClient.post<ResourcingRequestDetail>(
      `/api/v1/resourcing/requests/${requestId}/submit`,
    )
  }

  public decideProposal(
    requestId: string,
    proposalId: string,
    input: DecideResourcingProposalInput,
  ): Promise<ResourcingProposal> {
    return apiClient.post<ResourcingProposal>(
      `/api/v1/resourcing/requests/${requestId}/proposals/${proposalId}/decide`,
      input,
    )
  }
}

export const resourcingApiService = new ResourcingApiService()
