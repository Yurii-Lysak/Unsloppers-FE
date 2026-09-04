export const mockSession = {
  userId: 'campaigns-e2e-user',
}

export const mockPermissions = {
  permissions: ['create_form_campaigns'],
}

export interface CampaignFixture {
  id: string
  title: string
  description: string
  purpose: string
  link: string
  dueDate: string
  status: 'draft' | 'active'
  creator: { id: string; displayName: string }
  createdAt: string
  updatedAt: string
}

export const createCampaignFixture = (
  overrides: Partial<CampaignFixture> = {},
): CampaignFixture => ({
  id: 'campaign-fixture-1',
  title: 'Annual Engagement Survey',
  description: 'A short pulse survey',
  purpose: 'Understand engagement trends',
  link: 'https://forms.example.com/annual-survey',
  dueDate: '2026-09-30',
  status: 'draft',
  creator: { id: 'emp-campaigns-e2e', displayName: 'Campaigns E2E User' },
  createdAt: '2026-09-04T10:00:00.000Z',
  updatedAt: '2026-09-04T10:00:00.000Z',
  ...overrides,
})

export const validCampaignFormInput = {
  title: 'Q4 Pulse Survey',
  description: 'Short description for the survey',
  purpose: 'Collect feedback before year end',
  link: 'https://forms.example.com/q4-pulse',
  dueDate: '2026-12-31',
}
