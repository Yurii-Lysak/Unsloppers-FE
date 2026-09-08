import { apiClient } from '@/api/client'
import type {
  CreateResourcingProposalInput,
  CreateResourcingRequestInput,
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
}

export const resourcingApiService = new ResourcingApiService()
