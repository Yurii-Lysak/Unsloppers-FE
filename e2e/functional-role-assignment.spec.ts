import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'
import { PERMISSION_KEYS } from '../src/types/permissions'

const apiBaseUrl = testEnv.api.baseUrl

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

test.describe('Functional role assignment navigation', () => {
  test('shows All Employees nav for authenticated users', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [])

    await page.goto('/')
    await expect(page.getByTestId('sidebar-employees')).toBeVisible()
  })

  test('shows Campaigns nav when create_form_campaigns is granted', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS])

    await page.goto('/')
    await page.waitForResponse(response => response.url().includes('/permissions/me'))
    await expect(page.getByTestId('sidebar-campaigns')).toBeVisible()
  })

  test('hides Campaigns nav when permission is absent', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [])

    await page.goto('/')
    await expect(page.getByTestId('sidebar-campaigns')).toHaveCount(0)
  })

  test('shows Admin → Roles via permissions/me', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES])

    await page.goto('/')
    await expect(page.getByTestId('sidebar-admin-roles')).toBeVisible()
  })
})

test.describe('Functional role assignment form', () => {
  test('hides employment section when manage_functional_roles is absent', async ({ page }) => {
    const employeeId = 'employee-2'

    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [])

    await page.route(`${apiBaseUrl}/api/v1/employees/${employeeId}/profile**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          employeeId,
          displayName: 'Anton Savchenko',
          audience: { role: 'Colleague', sections: { S1: 'R', S10: 'R', S11: 'R' } },
          sections: {
            S1: {
              accessLevel: 'R',
              data: { displayName: 'Anton Savchenko' },
            },
          },
        }),
      })
    })

    await page.goto(`/employees/${employeeId}`)
    await expect(page.getByTestId('employment-section')).toHaveCount(0)
    await expect(page.getByTestId('functional-roles-form')).toHaveCount(0)
  })

  test('HR Admin saves role assignments on employee profile', async ({ page }) => {
    const employeeId = 'employee-2'
    let savedRoleIds: string[] = []

    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES])

    await page.route(`${apiBaseUrl}/api/v1/employees/${employeeId}/profile**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          employeeId,
          displayName: 'Anton Savchenko',
          audience: { role: 'ReportingLine', sections: { S1: 'RW' } },
          sections: {
            S1: {
              accessLevel: 'RW',
              data: { displayName: 'Anton Savchenko' },
            },
          },
        }),
      })
    })

    await page.route(`${apiBaseUrl}/api/v1/employees/${employeeId}**`, async route => {
      if (route.request().method() === 'GET' && route.request().url().endsWith(`/employees/${employeeId}`)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: employeeId, displayName: 'Anton Savchenko' }),
        })
        return
      }
      if (route.request().url().includes('/functional-roles')) {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          })
          return
        }
        if (route.request().method() === 'PUT') {
          const body = route.request().postDataJSON() as { roleIds: string[] }
          savedRoleIds = body.roleIds
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 'role-campaign',
                name: 'IT Campaign Sender',
                isBuiltIn: false,
                permissionKeys: [PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS],
              },
            ]),
          })
          return
        }
      }
      await route.continue()
    })

    await page.route(`${apiBaseUrl}/api/v1/functional-roles**`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'role-campaign',
            name: 'IT Campaign Sender',
            isBuiltIn: false,
            permissionKeys: [PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS],
          },
        ]),
      })
    })

    await page.goto(`/employees/${employeeId}`)
    await page.getByTestId('functional-role-option-role-campaign').check()
    await page.getByTestId('functional-roles-save').click()

    await expect.poll(() => savedRoleIds).toEqual(['role-campaign'])
  })
})

test.describe('Functional role assignment route guard', () => {
  test('redirects deep-linked functional-roles edit without manage_functional_roles', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await routePermissionsMe(page, [])

    await page.goto('/employees/employee-2/functional-roles')
    await expect(page).toHaveURL('/')
  })
})
