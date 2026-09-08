import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl

const umConfig = {
  variant: 'um',
  grouping: 'people',
  blocks: ['counters', 'table', 'ownActionItems', 'quickNav'],
  counters: [
    { id: 'headcount', providerId: 'audience', labelKey: 'dashboard.counters.headcount' },
    { id: 'totalActive', providerId: 'risks', labelKey: 'dashboard.counters.activeRisk' },
  ],
  resolvedBy: 'functional-role',
}

const dmConfig = {
  variant: 'dm',
  grouping: 'project',
  blocks: ['counters', 'table', 'ownActionItems', 'quickNav'],
  counters: umConfig.counters,
  resolvedBy: 'functional-role',
}

const umSummary = {
  variant: 'um',
  grouping: 'people',
  counters: {
    headcount: { status: 'available', value: 2 },
    totalActive: { status: 'available', value: 1 },
  },
  rows: [
    {
      employeeId: 'sub-1',
      displayName: 'Sub One',
      risk: { level: 'high', trend: 'up', recordedAt: '2026-01-04' },
      leaveStatus: 'unavailable',
      projectStatus: 'unavailable',
    },
    {
      employeeId: 'sub-2',
      displayName: 'Sub Two',
      leaveStatus: 'unavailable',
      projectStatus: 'unavailable',
    },
  ],
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
  test('renders UM dashboard with scoped table rows', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardApi(page, 'um')

    await page.goto('/')

    await expect(page.getByTestId('dashboard-title')).toBeVisible()
    await expect(page.getByTestId('dashboard-engine')).toBeVisible()
    await expect(page.getByTestId('dashboard-counter-headcount')).toBeVisible()
    await expect(page.getByTestId('dashboard-row-sub-1')).toBeVisible()
    await expect(page.getByTestId('dashboard-row-sub-2')).toBeVisible()
    await expect(page.getByTestId('dashboard-action-item-item-1')).toBeVisible()
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
