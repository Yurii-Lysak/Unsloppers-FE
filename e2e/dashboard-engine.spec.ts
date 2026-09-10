import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl

const umQuickNav = [
  { labelKey: 'dashboard.quickNav.employees', path: '/employees' },
  { labelKey: 'dashboard.quickNav.savedViews', path: '/employees' },
  { labelKey: 'dashboard.quickNav.resourcing', path: '/resourcing' },
  { labelKey: 'dashboard.quickNav.risks', path: '/risks' },
  { labelKey: 'dashboard.quickNav.mentorship', path: '/mentorship' },
  { labelKey: 'dashboard.quickNav.campaigns', path: '/campaigns' },
]

const umCounters = [
  { id: 'headcount', providerId: 'audience', labelKey: 'dashboard.counters.headcount' },
  { id: 'need_attention', providerId: 'risks', labelKey: 'dashboard.counters.needAttention' },
  { id: 'medium', providerId: 'risks', labelKey: 'dashboard.counters.medium' },
  { id: 'high', providerId: 'risks', labelKey: 'dashboard.counters.high' },
  { id: 'leaver', providerId: 'risks', labelKey: 'dashboard.counters.leaver' },
  { id: 'openActionItems', providerId: 'action-items', labelKey: 'dashboard.counters.openActionItems' },
  { id: 'overdueActionItems', providerId: 'action-items', labelKey: 'dashboard.counters.overdueActionItems' },
  { id: 'openResourcingRequests', providerId: 'resourcing', labelKey: 'dashboard.counters.openResourcingRequests' },
  { id: 'openCampaigns', providerId: 'campaigns', labelKey: 'dashboard.counters.openCampaigns' },
]

const umConfig = {
  variant: 'um',
  grouping: 'people',
  blocks: ['counters', 'table', 'ownActionItems', 'quickNav'],
  counters: umCounters,
  quickNav: umQuickNav,
  resolvedBy: 'functional-role',
}

const dmCounters = [
  { id: 'headcount', providerId: 'audience', labelKey: 'dashboard.counters.headcount' },
  { id: 'need_attention', providerId: 'risks', labelKey: 'dashboard.counters.needAttention' },
  { id: 'medium', providerId: 'risks', labelKey: 'dashboard.counters.medium' },
  { id: 'high', providerId: 'risks', labelKey: 'dashboard.counters.high' },
  { id: 'leaver', providerId: 'risks', labelKey: 'dashboard.counters.leaver' },
  {
    id: 'openResourcingRequests',
    providerId: 'resourcing',
    labelKey: 'dashboard.counters.openResourcingRequests',
  },
]

const dmConfig = {
  variant: 'dm',
  grouping: 'project',
  blocks: ['counters', 'table', 'resourcingRequests', 'ownActionItems', 'quickNav'],
  counters: dmCounters,
  quickNav: [
    { labelKey: 'dashboard.quickNav.employees', path: '/employees' },
    { labelKey: 'dashboard.quickNav.risks', path: '/risks' },
    { labelKey: 'dashboard.quickNav.campaigns', path: '/campaigns' },
  ],
  selectorProjects: [
    { projectId: 'proj-a', projectName: 'proj-a' },
    { projectId: 'proj-b', projectName: 'proj-b' },
  ],
  resolvedBy: 'functional-role',
}

const umSummary = {
  variant: 'um',
  grouping: 'people',
  counters: {
    headcount: { status: 'available', value: 2 },
    need_attention: { status: 'available', value: 0 },
    medium: { status: 'available', value: 1 },
    high: { status: 'available', value: 1 },
    leaver: { status: 'available', value: 0 },
    openActionItems: { status: 'available', value: 4 },
    overdueActionItems: { status: 'available', value: 1 },
    openResourcingRequests: { status: 'available', value: 2 },
    openCampaigns: { status: 'available', value: 1 },
  },
  rows: [
    {
      employeeId: 'sub-1',
      displayName: 'Sub One',
      risk: { level: 'high', trend: 'up', recordedAt: '2026-01-04' },
      leaveStatus: 'available',
      leaveLabel: 'On vacation',
      projectStatus: 'available',
      projectLabel: 'Atlas Migration',
    },
    {
      employeeId: 'sub-2',
      displayName: 'Sub Two',
      leaveStatus: 'available',
      leaveLabel: '—',
      projectStatus: 'available',
      projectLabel: 'Billing v2',
    },
  ],
  pagination: { page: 1, pageSize: 50, totalRows: 2 },
}

const dmSummary = {
  variant: 'dm',
  grouping: 'project',
  counters: {
    headcount: { status: 'available', value: 1 },
    need_attention: { status: 'available', value: 0 },
    medium: { status: 'available', value: 0 },
    high: { status: 'available', value: 1 },
    leaver: { status: 'available', value: 0 },
    openResourcingRequests: { status: 'available', value: 1 },
  },
  groups: [
    {
      projectId: 'proj-a',
      projectName: 'proj-a',
      rows: [
        {
          employeeId: 'member-1',
          displayName: 'Member One',
          leaveStatus: 'unavailable',
          projectStatus: 'unavailable',
        },
      ],
    },
  ],
  selectorProjects: [
    { projectId: 'proj-a', projectName: 'proj-a' },
    { projectId: 'proj-b', projectName: 'proj-b' },
  ],
  resourcingRequests: [
    {
      id: 'req-1',
      vacancyDetails: 'Backend engineer',
      status: 'open',
      projectId: 'proj-a',
      authorDisplayName: 'DM Viewer',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
}

const pmCounters = [
  { id: 'headcount', providerId: 'audience', labelKey: 'dashboard.counters.headcount' },
  { id: 'need_attention', providerId: 'risks', labelKey: 'dashboard.counters.needAttention' },
  { id: 'medium', providerId: 'risks', labelKey: 'dashboard.counters.medium' },
  { id: 'high', providerId: 'risks', labelKey: 'dashboard.counters.high' },
  { id: 'leaver', providerId: 'risks', labelKey: 'dashboard.counters.leaver' },
  {
    id: 'openResourcingRequests',
    providerId: 'resourcing',
    labelKey: 'dashboard.counters.openResourcingRequests',
  },
]

const pmConfig = {
  variant: 'pm',
  grouping: 'project',
  blocks: ['counters', 'table', 'resourcingRequests', 'ownActionItems', 'quickNav'],
  counters: pmCounters,
  quickNav: [
    { labelKey: 'dashboard.quickNav.employees', path: '/employees' },
    { labelKey: 'dashboard.quickNav.risks', path: '/risks' },
    { labelKey: 'dashboard.quickNav.campaigns', path: '/campaigns' },
  ],
  resolvedBy: 'functional-role',
}

const pmSummary = {
  variant: 'pm',
  grouping: 'project',
  counters: {
    headcount: { status: 'available', value: 1 },
    need_attention: { status: 'available', value: 0 },
    medium: { status: 'available', value: 0 },
    high: { status: 'available', value: 1 },
    leaver: { status: 'available', value: 0 },
    openResourcingRequests: { status: 'available', value: 1 },
  },
  groups: [
    {
      projectId: 'proj-pm-a',
      projectName: 'proj-pm-a',
      rows: [
        {
          employeeId: 'member-1',
          displayName: 'Member One',
          leaveStatus: 'unavailable',
          projectStatus: 'unavailable',
        },
      ],
    },
  ],
  resourcingRequests: [
    {
      id: 'req-pm-1',
      vacancyDetails: 'Backend engineer',
      status: 'open',
      projectId: 'proj-pm-a',
      authorDisplayName: 'PM Viewer',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
}

const ppCounters = [
  { id: 'headcount', providerId: 'audience', labelKey: 'dashboard.counters.headcount' },
  { id: 'need_attention', providerId: 'risks', labelKey: 'dashboard.counters.needAttention' },
  { id: 'medium', providerId: 'risks', labelKey: 'dashboard.counters.medium' },
  { id: 'high', providerId: 'risks', labelKey: 'dashboard.counters.high' },
  { id: 'leaver', providerId: 'risks', labelKey: 'dashboard.counters.leaver' },
  { id: 'openActionItems', providerId: 'action-items', labelKey: 'dashboard.counters.openActionItems' },
  { id: 'overdueActionItems', providerId: 'action-items', labelKey: 'dashboard.counters.overdueActionItems' },
  { id: 'openCampaigns', providerId: 'campaigns', labelKey: 'dashboard.counters.openCampaigns' },
]

const ppConfig = {
  variant: 'pp',
  grouping: 'people',
  blocks: ['counters', 'table', 'idpDeadlines', 'ownActionItems', 'quickNav'],
  counters: ppCounters,
  quickNav: [
    { labelKey: 'dashboard.quickNav.employees', path: '/employees' },
    { labelKey: 'dashboard.quickNav.risks', path: '/risks' },
    { labelKey: 'dashboard.quickNav.mentorship', path: '/mentorship' },
    { labelKey: 'dashboard.quickNav.campaigns', path: '/campaigns' },
  ],
  resolvedBy: 'functional-role',
}

const ppSummary = {
  variant: 'pp',
  grouping: 'people',
  counters: {
    headcount: { status: 'available', value: 2 },
    need_attention: { status: 'available', value: 0 },
    medium: { status: 'available', value: 0 },
    high: { status: 'available', value: 0 },
    leaver: { status: 'available', value: 0 },
    openActionItems: { status: 'available', value: 1 },
    overdueActionItems: { status: 'available', value: 0 },
    openCampaigns: { status: 'available', value: 0 },
  },
  rows: [
    {
      employeeId: 'pp-sub-1',
      displayName: 'HR Assignee',
      leaveStatus: 'unavailable',
      projectStatus: 'available',
      projectLabel: 'Atlas Migration',
      departmentStatus: 'available',
      departmentLabel: 'HR',
    },
    {
      employeeId: 'pp-sub-2',
      displayName: 'Sales Assignee',
      leaveStatus: 'unavailable',
      projectStatus: 'available',
      projectLabel: 'Billing v2',
      departmentStatus: 'available',
      departmentLabel: 'sales',
    },
  ],
  idpDeadlines: [
    {
      id: 'idp-1',
      employeeId: 'pp-sub-1',
      employeeDisplayName: 'HR Assignee',
      description: 'Leadership plan',
      deadline: '2026-01-20',
    },
  ],
}

const quickNavPermissions = {
  permissions: [
    'create_resourcing_requests',
    'fulfil_resourcing_requests',
    'create_form_campaigns',
  ],
}

const emptyEmployeeList = {
  fields: [
    {
      id: 'name',
      name: 'Name',
      type: 'text',
      source: 'builtin',
      sortable: true,
      filterable: true,
    },
  ],
  rows: [],
  total: 0,
  page: 1,
  pageSize: 50,
}

const emptyRiskDashboard = {
  counts: {
    need_attention: 0,
    medium: 0,
    high: 0,
    leaver: 0,
    totalActive: 0,
  },
  rows: [],
  total: 0,
  page: 1,
  pageSize: 50,
}

const quickNavClickThrough = [
  { testId: 'employees', path: '/employees', destinationTestId: 'directory-title' },
  { testId: 'savedViews', path: '/employees', destinationTestId: 'directory-title' },
  { testId: 'resourcing', path: '/resourcing', destinationTestId: 'resourcing-title' },
  { testId: 'risks', path: '/risks', destinationTestId: 'risk-dashboard-title' },
  { testId: 'mentorship', path: '/mentorship', destinationTestId: 'mentorship-hub-title' },
  { testId: 'campaigns', path: '/campaigns', destinationTestId: 'campaigns-title' },
]

const fulfillJson = (body: unknown) => ({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify(body),
})

const setupQuickNavDestinationMocks = async (
  page: import('@playwright/test').Page,
) => {
  await page.route(`${apiBaseUrl}/api/v1/permissions/me**`, async route => {
    await route.fulfill(fulfillJson(quickNavPermissions))
  })

  await page.route(`${apiBaseUrl}/api/v1/employees**`, async route => {
    await route.fulfill(fulfillJson(emptyEmployeeList))
  })

  await page.route(`${apiBaseUrl}/api/v1/saved-views**`, async route => {
    await route.fulfill(fulfillJson([]))
  })

  await page.route(`${apiBaseUrl}/api/v1/resourcing/requests**`, async route => {
    await route.fulfill(fulfillJson([]))
  })

  await page.route(`${apiBaseUrl}/api/v1/resourcing/requests/assigned**`, async route => {
    await route.fulfill(fulfillJson([]))
  })

  await page.route(`${apiBaseUrl}/api/v1/risks/dashboard**`, async route => {
    await route.fulfill(fulfillJson(emptyRiskDashboard))
  })

  await page.route(`${apiBaseUrl}/api/v1/risks/dashboard/access**`, async route => {
    await route.fulfill(fulfillJson({ canAccess: true }))
  })

  await page.route(`${apiBaseUrl}/api/v1/mentorship/willing-mentors**`, async route => {
    await route.fulfill(fulfillJson({ mentors: [] }))
  })

  await page.route(`${apiBaseUrl}/api/v1/mentorship/assignable-mentees**`, async route => {
    await route.fulfill(fulfillJson({ mentees: [] }))
  })

  await page.route(`${apiBaseUrl}/api/v1/mentorship/pairs**`, async route => {
    await route.fulfill(fulfillJson({ pairs: [] }))
  })

  await page.route(`${apiBaseUrl}/api/v1/campaigns**`, async route => {
    await route.fulfill(fulfillJson([]))
  })
}

const configByVariant = { um: umConfig, dm: dmConfig, pm: pmConfig, pp: ppConfig }
const summaryByVariant = { um: umSummary, dm: dmSummary, pm: pmSummary, pp: ppSummary }

const setupDashboardApi = async (
  page: import('@playwright/test').Page,
  variant: 'um' | 'dm' | 'pm' | 'pp',
) => {
  await page.route(`${apiBaseUrl}/api/v1/permissions/me**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ permissions: [] }),
    })
  })

  await page.route(`${apiBaseUrl}/api/v1/dashboards/config**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(configByVariant[variant]),
    })
  })

  await page.route(`${apiBaseUrl}/api/v1/dashboards/summary**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(summaryByVariant[variant]),
    })
  })

  await page.route(`${apiBaseUrl}/api/v1/me/authored-action-items**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'item-1',
          title: 'Follow up',
          dueDate: '2026-01-01',
          status: 'open',
          isOverdue: true,
          assignee: { id: 'sub-1', displayName: 'Sub One' },
        },
      ]),
    })
  })
}

test.describe('Dashboard engine', () => {
  test('renders UM dashboard with scoped table rows and nine counters', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'um')

    await page.goto('/')

    await expect(page.getByTestId('dashboard-title')).toBeVisible()
    await expect(page.getByTestId('dashboard-engine')).toBeVisible()
    for (const counterId of [
      'headcount',
      'need_attention',
      'medium',
      'high',
      'leaver',
      'openActionItems',
      'overdueActionItems',
      'openResourcingRequests',
      'openCampaigns',
    ]) {
      await expect(page.getByTestId(`dashboard-counter-${counterId}`)).toBeVisible()
    }
    await expect(page.getByTestId('dashboard-row-sub-1')).toBeVisible()
    await expect(page.getByTestId('dashboard-row-sub-2')).toBeVisible()
    await expect(page.getByTestId('dashboard-row-sub-1')).toContainText('On vacation')
    await expect(page.getByTestId('dashboard-row-sub-1')).toContainText('Atlas Migration')
    await expect(page.getByTestId('dashboard-action-item-item-1')).toBeVisible()
  })

  test('hides pagination controls when total rows fit on one page', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'um')

    await page.goto('/')

    await expect(page.getByTestId('dashboard-table-pagination')).toHaveCount(0)
  })

  test('renders pagination controls when total rows exceed page size', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/config**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(umConfig),
      })
    })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/summary**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...umSummary,
          pagination: { page: 1, pageSize: 50, totalRows: 60 },
        }),
      })
    })
    await page.route(`${apiBaseUrl}/api/v1/me/authored-action-items**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    await page.goto('/')

    await expect(page.getByTestId('dashboard-table-pagination')).toBeVisible()
    await expect(page.getByTestId('dashboard-pagination-next')).toBeEnabled()
    await expect(page.getByTestId('dashboard-pagination-prev')).toBeDisabled()
  })

  test('renders six quick nav links from config', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'um')

    await page.goto('/')

    await expect(page.getByTestId('dashboard-quick-nav-employees')).toBeVisible()
    await expect(page.getByTestId('dashboard-quick-nav-savedViews')).toBeVisible()
    await expect(page.getByTestId('dashboard-quick-nav-resourcing')).toBeVisible()
    await expect(page.getByTestId('dashboard-quick-nav-risks')).toBeVisible()
    await expect(page.getByTestId('dashboard-quick-nav-mentorship')).toBeVisible()
    await expect(page.getByTestId('dashboard-quick-nav-campaigns')).toBeVisible()
  })

  test('navigates from quick nav links to destination pages', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'um')
    await setupQuickNavDestinationMocks(page)

    for (const destination of quickNavClickThrough) {
      await page.goto('/')
      await expect(page.getByTestId('dashboard-quick-nav')).toBeVisible()
      await page.getByTestId(`dashboard-quick-nav-${destination.testId}`).click()
      await expect(page).toHaveURL(new RegExp(`${destination.path.replace('/', '\\/')}$`))
      await expect(page.getByTestId(destination.destinationTestId)).toBeVisible()
    }
  })

  test('renders DM dashboard with shared engine components and project groups', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'dm')

    await page.goto('/')

    await expect(page.getByTestId('dashboard-engine')).toBeVisible()
    await expect(page.getByTestId('dashboard-project-selector')).toBeVisible()
    await expect(page.getByTestId('dashboard-group-proj-a')).toBeVisible()
    await expect(page.getByTestId('dashboard-counter-grid')).toBeVisible()
    await expect(page.getByTestId('dashboard-resourcing-block')).toBeVisible()
    await expect(page.getByTestId('dashboard-resourcing-request-req-1')).toBeVisible()
    await expect(page.getByTestId('dashboard-action-items')).toBeVisible()
  })

  test('refetches DM summary when project selector changes', async ({ page }) => {
    const summaryRequests: string[] = []

    await setupAuthApi(page, { authenticated: true })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/config**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(dmConfig),
      })
    })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/summary**`, async route => {
      summaryRequests.push(route.request().url())
      const projectId = new URL(route.request().url()).searchParams.get('projectId')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...dmSummary,
          groups: projectId === 'proj-b'
            ? []
            : dmSummary.groups,
          counters: {
            ...dmSummary.counters,
            headcount: {
              status: 'available',
              value: projectId === 'proj-b' ? 0 : 1,
            },
          },
        }),
      })
    })
    await page.route(`${apiBaseUrl}/api/v1/me/authored-action-items**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    await page.goto('/')
    await page.getByTestId('dashboard-project-selector-trigger').click()
    await page.getByRole('option', { name: 'proj-b' }).click()

    await expect.poll(() => summaryRequests.some(url => url.includes('projectId=proj-b'))).toBe(true)
    await expect(page.getByTestId('dashboard-group-proj-a')).toHaveCount(0)
  })

  test('renders PM dashboard with DM-shaped engine, "Your projects" heading, resourcing block, and no selector', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'pm')

    await page.goto('/')

    await expect(page.getByTestId('dashboard-engine')).toBeVisible()
    for (const counterId of [
      'headcount',
      'need_attention',
      'medium',
      'high',
      'leaver',
      'openResourcingRequests',
    ]) {
      await expect(page.getByTestId(`dashboard-counter-${counterId}`)).toBeVisible()
    }
    await expect(page.getByTestId('dashboard-group-proj-pm-a')).toBeVisible()
    await expect(page.getByText('Your projects')).toBeVisible()
    await expect(page.getByTestId('dashboard-resourcing-block')).toBeVisible()
    await expect(page.getByTestId('dashboard-resourcing-request-req-pm-1')).toBeVisible()
    await expect(page.getByTestId('dashboard-project-selector')).toHaveCount(0)
  })

  test('shows access denied without calling summary when config is forbidden', async ({
    page,
  }) => {
    let summaryRequested = false

    await setupAuthApi(page, { authenticated: true })
    await page.route(`${apiBaseUrl}/api/v1/permissions/me**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ permissions: [] }),
      })
    })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/config**`, async route => {
      await route.fulfill({ status: 403, contentType: 'application/json', body: '{}' })
    })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/summary**`, async route => {
      summaryRequested = true
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    })

    await page.goto('/')

    await expect(page.getByTestId('dashboard-access-denied')).toBeVisible()
    expect(summaryRequested).toBe(false)
  })

  test('renders PP dashboard with group-by toggle, IDP widget, and no resourcing block', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'pp')

    await page.goto('/')

    await expect(page.getByTestId('dashboard-engine')).toBeVisible()
    for (const counterId of [
      'headcount',
      'need_attention',
      'medium',
      'high',
      'leaver',
      'openActionItems',
      'overdueActionItems',
      'openCampaigns',
    ]) {
      await expect(page.getByTestId(`dashboard-counter-${counterId}`)).toBeVisible()
    }
    await expect(page.getByTestId('dashboard-group-by-toggle')).toBeVisible()
    await expect(page.getByTestId('dashboard-client-group-hr')).toBeVisible()
    await expect(page.getByTestId('dashboard-idp-block')).toBeVisible()
    await expect(page.getByTestId('dashboard-idp-row-idp-1')).toBeVisible()
    await expect(page.getByTestId('dashboard-resourcing-block')).toHaveCount(0)
    await expect(page.getByTestId('dashboard-quick-nav-resourcing')).toHaveCount(0)
    await expect(page.getByTestId('dashboard-quick-nav-mentorship')).toBeVisible()

    await page.getByTestId('dashboard-group-by-project').click()
    await expect(page.getByTestId('dashboard-client-group-atlas migration')).toBeVisible()
    await expect(page.getByTestId('dashboard-client-group-billing v2')).toBeVisible()
  })

  test('merges PP department groups case-insensitively and buckets unavailable values under Unassigned', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/config**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ppConfig),
      })
    })
    await page.route(`${apiBaseUrl}/api/v1/dashboards/summary**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...ppSummary,
          rows: [
            ...ppSummary.rows,
            {
              employeeId: 'pp-sub-3',
              displayName: 'Lowercase HR Assignee',
              leaveStatus: 'unavailable',
              projectStatus: 'unavailable',
              departmentStatus: 'available',
              departmentLabel: 'hr',
            },
            {
              employeeId: 'pp-sub-4',
              displayName: 'No Department',
              leaveStatus: 'unavailable',
              projectStatus: 'unavailable',
              departmentStatus: 'unavailable',
              departmentLabel: 'Ghost Dept',
            },
          ],
        }),
      })
    })

    await page.goto('/')

    await expect(page.getByTestId('dashboard-client-group-hr')).toBeVisible()
    await expect(page.getByTestId('dashboard-client-group-sales')).toBeVisible()
    await expect(page.getByTestId('dashboard-client-group-unassigned')).toBeVisible()
    await expect(page.getByTestId('dashboard-client-group-ghost dept')).toHaveCount(0)
  })
})
