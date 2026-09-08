import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'

const sampleDashboard = {
  counts: {
    need_attention: 0,
    medium: 1,
    high: 2,
    leaver: 0,
    totalActive: 3,
  },
  rows: [
    {
      employeeId: 'emp-high-1',
      displayName: 'High One',
      currentLevel: 'high',
      trend: 'up',
      recordedAt: '2026-01-04',
      managerName: 'Manager A',
      peoplePartnerName: 'PP A',
    },
    {
      employeeId: 'emp-medium-1',
      displayName: 'Medium One',
      currentLevel: 'medium',
      recordedAt: '2026-01-03',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 50,
}

test.describe('Risk dashboard', () => {
  test('filters by counter card and opens profile from a row', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })

    await page.route('**/api/v1/risks/dashboard/access', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ canAccess: true }),
      })
    })

    let requestedLevel: string | null = null

    await page.route('**/api/v1/risks/dashboard**', async route => {
      if (route.request().url().includes('/risks/dashboard/access')) {
        await route.fallback()
        return
      }

      const url = new URL(route.request().url())
      requestedLevel = url.searchParams.get('level')
      const rows =
        requestedLevel === 'high'
          ? sampleDashboard.rows.filter(row => row.currentLevel === 'high')
          : sampleDashboard.rows

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...sampleDashboard,
          rows,
          total: rows.length,
        }),
      })
    })

    await page.goto('/risks')

    await expect(page.getByTestId('risk-dashboard-title')).toBeVisible()
    await expect(page.getByTestId('risk-counter-high')).toBeVisible()

    await page.getByTestId('risk-counter-high').click()
    await expect.poll(() => requestedLevel).toBe('high')
    await expect(page.getByTestId('risk-dashboard-row-emp-high-1')).toBeVisible()
    await expect(page.getByTestId('risk-dashboard-row-emp-medium-1')).toHaveCount(0)

    await page.getByTestId('risk-dashboard-row-emp-high-1').click()
    await expect(page).toHaveURL(/\/employees\/emp-high-1$/)
  })
})
