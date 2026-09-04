export type CampaignStatus = 'draft' | 'active'

export interface CampaignCreator {
  id: string
  displayName: string
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
}

export interface CreateCampaignInput {
  title: string
  description: string
  purpose: string
  link: string
  dueDate: string
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>
