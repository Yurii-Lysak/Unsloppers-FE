export const mockSession = {
  userId: 'campaigns-e2e-user',
}

export const mockPermissions = {
  permissions: ['create_form_campaigns'],
}

export interface CampaignAudienceFixture {
  filters: Array<{
    fieldId: string
    operator: string
    value: unknown
  }>
  addedEmployeeIds: string[]
  excludedEmployeeIds: string[]
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
  audience: CampaignAudienceFixture
}

export const emptyAudienceFixture = (): CampaignAudienceFixture => ({
  filters: [],
  addedEmployeeIds: [],
  excludedEmployeeIds: [],
})

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
  audience: emptyAudienceFixture(),
  ...overrides,
})

export const mockEmployeesListResponse = {
  fields: [
    {
      id: 'name',
      name: 'Name',
      type: 'text',
      source: 'builtin',
      sortable: true,
      filterable: true,
    },
    {
      id: 'department',
      name: 'Department',
      type: 'select',
      source: 'builtin',
      sortable: true,
      filterable: true,
      options: ['Engineering', 'Sales'],
    },
    {
      id: 'grade',
      name: 'Grade',
      type: 'select',
      source: 'builtin',
      sortable: true,
      filterable: true,
      options: ['Mid', 'Senior'],
    },
  ],
  rows: [
    {
      employeeId: 'emp-alice',
      cells: { name: 'Alice', department: 'Engineering', grade: 'Mid' },
    },
    {
      employeeId: 'emp-bob',
      cells: { name: 'Bob', department: 'Engineering', grade: 'Mid' },
    },
    {
      employeeId: 'emp-carol',
      cells: { name: 'Carol', department: 'Sales', grade: 'Senior' },
    },
  ],
  total: 3,
  page: 1,
  pageSize: 100,
}

export const validCampaignFormInput = {
  title: 'Q4 Pulse Survey',
  description: 'Short description for the survey',
  purpose: 'Collect feedback before year end',
  link: 'https://forms.example.com/q4-pulse',
  dueDate: '2026-12-31',
}
