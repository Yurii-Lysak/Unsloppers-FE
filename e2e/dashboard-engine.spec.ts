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

const dmConfig = {
  variant: 'dm',
  grouping: 'project',
  blocks: ['counters', 'table', 'ownActionItems', 'quickNav'],
  counters: [
    { id: 'headcount', providerId: 'audience', labelKey: 'dashboard.counters.headcount' },
    { id: 'totalActive', providerId: 'risks', labelKey: 'dashboard.counters.activeRisk' },
  ],
  quickNav: [
    { labelKey: 'dashboard.quickNav.employees', path: '/employees' },
    { labelKey: 'dashboard.quickNav.risks', path: '/risks' },
    { labelKey: 'dashboard.quickNav.campaigns', path: '/campaigns' },
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
    totalActive: { status: 'unavailable' },
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

const setupDashboardApi = async (
  page: import('@playwright/test').Page,
  variant: 'um' | 'dm',
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
      body: JSON.stringify(variant === 'um' ? umConfig : dmConfig),
    })
  })

  await page.route(`${apiBaseUrl}/api/v1/dashboards/summary**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(variant === 'um' ? umSummary : dmSummary),
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
    await expect(page.getByTestId('dashboard-group-proj-a')).toBeVisible()
    await expect(page.getByTestId('dashboard-counter-grid')).toBeVisible()
    await expect(page.getByTestId('dashboard-action-items')).toBeVisible()
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
})
