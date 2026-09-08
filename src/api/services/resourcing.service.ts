import { apiClient } from '@/api/client'
import type {
  CreateResourcingRequestInput,
  ResourcingRequest,
} from '@/types/resourcing'

class ResourcingApiService {
  public getRequestsList = (): Promise<ResourcingRequest[]> =>
    apiClient.get<ResourcingRequest[]>('/api/v1/resourcing/requests')

  public createRequest(input: CreateResourcingRequestInput): Promise<ResourcingRequest> {
    return apiClient.post<ResourcingRequest>('/api/v1/resourcing/requests', input)
  }
}

export const resourcingApiService = new ResourcingApiService()
