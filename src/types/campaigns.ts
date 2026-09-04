export type CampaignStatus = 'draft' | 'active'

export interface CampaignCreator {
  id: string
  displayName: string
}

export interface CampaignAudienceDefinition {
  filters: import('@/types/employees').EmployeeFieldFilter[]
  addedEmployeeIds: string[]
  excludedEmployeeIds: string[]
}

export interface Campaign {
  id: string
  title: string
  description: string
  purpose: string
  link: string
  dueDate: string
  status: CampaignStatus
  creator: CampaignCreator
  createdAt: string
  updatedAt: string
  audience: CampaignAudienceDefinition
}

export interface CampaignAudiencePreview {
  fields: import('@/types/employees').FieldSpec[]
  rows: import('@/types/employees').EmployeeRow[]
  total: number
  page: number
  pageSize: number
}

export interface CreateCampaignInput {
  title: string
  description: string
  purpose: string
  link: string
  dueDate: string
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>
