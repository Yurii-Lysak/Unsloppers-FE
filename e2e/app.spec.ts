import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'
import { testIds } from './shared/selectors'

const apiBaseUrl = testEnv.api.baseUrl

const setupDashboardHomeMocks = async (page: import('@playwright/test').Page) => {
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
      body: JSON.stringify({
        variant: 'um',
        grouping: 'people',
        blocks: ['counters', 'table'],
        counters: [
          {
            id: 'headcount',
            providerId: 'audience',
            labelKey: 'dashboard.counters.headcount',
          },
        ],
        resolvedBy: 'functional-role',
      }),
    })
  })

  await page.route(`${apiBaseUrl}/api/v1/dashboards/summary**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        variant: 'um',
        grouping: 'people',
        counters: { headcount: { status: 'available', value: 0 } },
        rows: [],
      }),
    })
  })
}

test.describe('App', () => {
  test('should load homepage successfully', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardHomeMocks(page)
    await page.goto('/')

    await expect(page.getByTestId(testIds.app.container)).toBeVisible()
    await expect(page.getByTestId(testIds.app.dashboardTitle)).toBeVisible()
  })

  test('should redirect unknown routes to home', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await setupDashboardHomeMocks(page)
    await page.goto('/some-unknown-route')

    await expect(page).toHaveURL('/')
    await expect(page.getByTestId(testIds.app.dashboardTitle)).toBeVisible()
  })
})
