import { expect, test } from '@playwright/test'

const employeeListResponse = {
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
      type: 'text',
      source: 'builtin',
      sortable: true,
      filterable: true,
    },
  ],
  rows: [
    {
      employeeId: 'emp-1',
      cells: { name: 'Alex Example', department: 'Engineering' },
      writableFieldIds: [],
    },
    {
      employeeId: 'emp-2',
      cells: { name: 'Zoe Example', department: 'Design' },
      writableFieldIds: [],
    },
  ],
  total: 2,
  page: 1,
  pageSize: 50,
  filtersHidden: false,
}

const stubDirectoryApis = async (page: import('@playwright/test').Page) => {
  await page.route('**/api/v1/auth/session', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ userId: 'user-1' }),
    }),
  )
  await page.route('**/api/v1/permissions/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ permissions: [] }),
    }),
  )
  await page.route('**/api/v1/saved-views', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    }),
  )
  await page.route('**/api/v1/employees?**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(employeeListResponse),
    }),
  )
  await page.route('**/api/v1/employees', route => {
    if (route.request().method() !== 'GET') {
      return route.continue()
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(employeeListResponse),
    })
  })
}

test.describe('All Employees card layout (Story 3.6)', () => {
  test('renders stacked cards below md and hides the data table', async ({ page }) => {
    await stubDirectoryApis(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/employees')

    await expect(page.getByTestId('directory-title')).toBeVisible()
    await expect(page.getByTestId('directory-card-list')).toBeVisible()
    await expect(page.getByTestId('directory-card-emp-1')).toBeVisible()
    await expect(page.getByTestId('directory-card-emp-1')).toContainText(
      'Alex Example',
    )
    await expect(page.getByTestId('directory-card-emp-1')).toContainText(
      'Engineering',
    )
    await expect(page.locator('.hidden.md\\:block table')).toBeHidden()
  })

  test('navigates to the employee profile when a card is tapped', async ({
    page,
  }) => {
    await stubDirectoryApis(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/employees')

    await page.getByTestId('directory-card-emp-1').click()
    await expect(page).toHaveURL('/employees/emp-1')
  })

  test('shows the data table at md and above', async ({ page }) => {
    await stubDirectoryApis(page)
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/employees')

    await expect(page.getByTestId('directory-card-list')).toBeHidden()
    await expect(page.locator('.hidden.md\\:block table')).toBeVisible()
  })
})
