import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl

const sampleRoles = [
  {
    id: 'role-hr-admin',
    name: 'HR Admin',
    isBuiltIn: true,
    permissionKeys: ['manage_functional_roles'],
  },
]

const sampleCatalog = [
  { key: 'create_form_campaigns', label: 'Create form campaigns' },
  { key: 'manage_functional_roles', label: 'Manage functional roles' },
]

const routeFunctionalRoles = async (
  page: import('@playwright/test').Page,
  status: number,
) => {
  await page.route(`${apiBaseUrl}/api/v1/functional-roles**`, async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(status === 200 ? sampleRoles : { message: 'Forbidden', statusCode: status }),
      })
      return
    }
    await route.continue()
  })
}

const routePermissionCatalog = async (
  page: import('@playwright/test').Page,
  status: number,
  body: unknown = sampleCatalog,
) => {
  await page.route(`${apiBaseUrl}/api/v1/permissions/catalog**`, async route => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
}

const routePermissionsMe = async (
  page: import('@playwright/test').Page,
  permissions: string[],
) => {
  await page.route(`${apiBaseUrl}/api/v1/permissions/me**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ permissions }),
    })
  })
}

test.describe('Admin roles navigation', () => {
  test('shows Admin → Roles in the sidebar when permissions/me includes manage_functional_roles', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, ['manage_functional_roles'])

    await page.goto('/')
    await page.waitForResponse(response => response.url().includes('/permissions/me'))
    await expect(page.getByRole('link', { name: 'Roles' })).toBeVisible()
    await expect(page.getByTestId('sidebar-admin-section')).toBeVisible()
  })

  test('hides Admin → Roles in the sidebar when permissions/me omits manage_functional_roles', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [])

    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Roles' })).toHaveCount(0)
  })

  test('redirects deep-linked /admin/roles when permissions/me omits manage_functional_roles', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [])

    await page.goto('/admin/roles')
    await expect(page).toHaveURL('/')
  })
})

test.describe('Admin roles form', () => {
  test('shows catalog failure instead of an empty permission list', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, ['manage_functional_roles'])
    await routeFunctionalRoles(page, 200)
    await routePermissionCatalog(page, 503, { message: 'Service unavailable' })

    await page.goto('/admin/roles')
    await page.waitForResponse(response => response.url().includes('/functional-roles'))
    await page.getByTestId('admin-roles-create').click()
    await expect(page.getByText('Could not load the permission catalog.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  test('creates a role when catalog and roles APIs succeed', async ({ page }) => {
    let roles = [...sampleRoles]

    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, ['manage_functional_roles'])
    await routePermissionCatalog(page, 200)

    await page.route(`${apiBaseUrl}/api/v1/functional-roles**`, async route => {
      const request = route.request()
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(roles),
        })
        return
      }
      if (request.method() === 'POST') {
        const body = request.postDataJSON() as {
          name: string
          permissionKeys: string[]
        }
        const created = {
          id: 'role-security-champion',
          name: body.name,
          isBuiltIn: false,
          permissionKeys: body.permissionKeys,
        }
        roles = [...roles, created]
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(created),
        })
        return
      }
      await route.continue()
    })

    await page.goto('/admin/roles')
    await page.waitForResponse(response => response.url().includes('/functional-roles'))
    await page.getByTestId('admin-roles-create').click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
    await page.getByLabel('Role name').fill('Security Champion')
    await page.getByLabel('Create form campaigns').check()
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Security Champion')).toBeVisible()
  })
})
