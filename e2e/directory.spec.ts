import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'
import { BUILTIN_FIELD_IDS } from '../src/types/employees'

const apiBaseUrl = testEnv.api.baseUrl

const sampleFields = [
  {
    id: BUILTIN_FIELD_IDS.name,
    name: 'Name',
    type: 'text',
    source: 'builtin',
    sortable: true,
    filterable: true,
  },
  {
    id: BUILTIN_FIELD_IDS.grade,
    name: 'Grade',
    type: 'text',
    source: 'builtin',
    sortable: true,
    filterable: true,
  },
]

const sampleListResponse = (overrides: Record<string, unknown> = {}) => ({
  fields: sampleFields,
  rows: [
    {
      employeeId: 'emp-1',
      cells: {
        [BUILTIN_FIELD_IDS.name]: 'Alpha',
        [BUILTIN_FIELD_IDS.grade]: 'Junior',
      },
    },
    {
      employeeId: 'emp-2',
      cells: {
        [BUILTIN_FIELD_IDS.name]: 'Bravo',
        [BUILTIN_FIELD_IDS.grade]: 'Senior',
      },
    },
  ],
  total: 128,
  page: 1,
  pageSize: 50,
  ...overrides,
})

const routeEmployees = async (
  page: import('@playwright/test').Page,
  body: unknown = sampleListResponse(),
) => {
  await page.route(`${apiBaseUrl}/api/v1/employees**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
}

test.describe('Directory page', () => {
  test('shows pagination count and page indicator', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routeEmployees(page)

    await page.goto('/directory')
    await expect(page.getByTestId('directory-title')).toBeVisible()
    await expect(page.getByTestId('directory-count')).toHaveText('2 of 128')
    await expect(page.getByTestId('directory-page-indicator')).toHaveText('Page 1 of 3')
  })

  test('updates sort state in the URL and table header', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routeEmployees(page)

    await page.goto('/directory')
    await page.getByTestId(`directory-sort-${BUILTIN_FIELD_IDS.grade}`).click()

    await expect(page).toHaveURL(/sort=grade/)
    await expect(page).toHaveURL(/order=asc/)
    await expect(
      page.getByTestId(`directory-sort-${BUILTIN_FIELD_IDS.grade}`).locator('svg'),
    ).toBeVisible()
  })

  test('navigates to the next page via pagination controls', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routeEmployees(
      page,
      sampleListResponse({
        page: 2,
        rows: sampleListResponse().rows.slice(0, 1),
      }),
    )

    await page.goto('/directory?page=2')
    await expect(page.getByTestId('directory-page-indicator')).toHaveText('Page 2 of 3')
    await page.getByTestId('directory-next-page').click()
    await expect(page).toHaveURL(/page=3/)
  })
})
