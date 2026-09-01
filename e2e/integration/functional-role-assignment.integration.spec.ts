import { expect, type Page, test } from '@playwright/test'
import { PERMISSION_KEYS } from '../../src/types/permissions'
import { BUILTIN_FIELD_IDS } from '../../src/types/employees'
import { testEnv } from '../shared/test-env'
import { loginBootcampUser } from './helpers/bootcamp-auth'

const BOOTCAMP_PASSWORD = process.env.BOOTCAMP_INITIAL_PASSWORD
const SITE_ADMIN_EMAIL = 'tt.site-admin@altexsoft.com'
const ASSIGNEE_EMAIL = 'artem.shamraiev@altexsoft.com'
const ASSIGNEE_NAME = 'Anton Savchenko'
const CAMPAIGN_ROLE_NAME = 'IT Campaign Sender'
const apiBaseUrl = testEnv.api.baseUrl

interface EmployeeSummary {
  id: string
  displayName: string
}

interface FunctionalRoleSummary {
  id: string
  name: string
}

interface EmployeeListResponse {
  rows: Array<{ employeeId: string; cells: Record<string, unknown> }>
}

const findAssigneeEmployee = async (page: Page): Promise<EmployeeSummary> => {
  const listResponse = await page.request.get(`${apiBaseUrl}/api/v1/employees`)
  expect(listResponse.ok(), await listResponse.text()).toBeTruthy()
  const body = (await listResponse.json()) as EmployeeListResponse
  const row = body.rows.find(
    entry => entry.cells[BUILTIN_FIELD_IDS.name] === ASSIGNEE_NAME,
  )
  expect(row, `Employee "${ASSIGNEE_NAME}" not found`).toBeDefined()
  return { id: row!.employeeId, displayName: ASSIGNEE_NAME }
}

const clearCampaignRoleFromAssignee = async (
  page: Page,
  campaignRoleId: string,
): Promise<EmployeeSummary> => {
  const assignee = await findAssigneeEmployee(page)
  const rolesResponse = await page.request.get(
    `${apiBaseUrl}/api/v1/employees/${assignee.id}/functional-roles`,
  )
  expect(rolesResponse.ok(), await rolesResponse.text()).toBeTruthy()
  const currentRoles = (await rolesResponse.json()) as FunctionalRoleSummary[]

  if (!currentRoles.some(role => role.id === campaignRoleId)) {
    return assignee
  }

  const putResponse = await page.request.put(
    `${apiBaseUrl}/api/v1/employees/${assignee.id}/functional-roles`,
    {
      data: {
        roleIds: currentRoles
          .map(role => role.id)
          .filter(roleId => roleId !== campaignRoleId),
      },
    },
  )
  expect(putResponse.ok(), await putResponse.text()).toBeTruthy()
  return assignee
}

const saveFunctionalRoles = async (page: Page) => {
  const saveButton = page.getByTestId('functional-roles-save')
  await expect(saveButton).toBeEnabled({ timeout: 10_000 })
  await Promise.all([
    page.waitForResponse(
      response =>
        response.url().includes('/functional-roles') &&
        response.request().method() === 'PUT' &&
        response.ok(),
      { timeout: 30_000 },
    ),
    saveButton.click(),
  ])
}

const ensureCampaignSenderRole = async (
  page: Page,
): Promise<{ id: string }> => {
  await page.getByTestId('sidebar-admin-roles').click()
  await expect(page).toHaveURL('/admin/roles')

  if ((await page.getByText(CAMPAIGN_ROLE_NAME).count()) === 0) {
    await page.getByTestId('admin-roles-create').click()
    await page.getByLabel('Role name').fill(CAMPAIGN_ROLE_NAME)
    await page.getByLabel('Create form campaigns').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText(CAMPAIGN_ROLE_NAME)).toBeVisible()
  }

  const listResponse = await page.request.get(`${apiBaseUrl}/api/v1/functional-roles`)
  expect(listResponse.ok(), await listResponse.text()).toBeTruthy()
  const roles = (await listResponse.json()) as Array<{ id: string; name: string }>
  const campaignRole = roles.find(role => role.name === CAMPAIGN_ROLE_NAME)
  expect(campaignRole).toBeDefined()
  return campaignRole!
}

test.describe('Functional role assignment (integration)', () => {
  test('UJ-3 two-session assignment updates assignee permissions and nav', async ({
    browser,
  }) => {
    test.setTimeout(120_000)
    test.skip(!BOOTCAMP_PASSWORD, 'BOOTCAMP_INITIAL_PASSWORD is required')

    const adminContext = await browser.newContext()
    const assigneeContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    const assigneePage = await assigneeContext.newPage()

    try {
      await loginBootcampUser(adminPage, SITE_ADMIN_EMAIL, BOOTCAMP_PASSWORD!)
      const campaignRole = await ensureCampaignSenderRole(adminPage)
      await clearCampaignRoleFromAssignee(adminPage, campaignRole.id)

      await loginBootcampUser(assigneePage, ASSIGNEE_EMAIL, BOOTCAMP_PASSWORD!)
      await assigneePage.goto('/')
      await assigneePage.waitForResponse(
        response => response.url().includes('/permissions/me') && response.ok(),
      )
      await expect(assigneePage.getByTestId('sidebar-campaigns')).toHaveCount(0)
      await expect(assigneePage.getByTestId('sidebar-admin-roles')).toHaveCount(0)

      await adminPage.goto(`/employees/${(await findAssigneeEmployee(adminPage)).id}`)
      const campaignRoleCheckbox = adminPage.getByTestId(
        `functional-role-option-${campaignRole.id}`,
      )
      await expect(campaignRoleCheckbox).not.toBeChecked()
      await campaignRoleCheckbox.check()
      await saveFunctionalRoles(adminPage)

      await adminPage.reload()
      await expect(campaignRoleCheckbox).toBeChecked()

      await assigneePage.goto('/')
      await assigneePage.waitForResponse(
        response => response.url().includes('/permissions/me') && response.ok(),
      )
      await expect(assigneePage.getByTestId('sidebar-campaigns')).toBeVisible()
      await expect(assigneePage.getByTestId('sidebar-admin-roles')).toHaveCount(0)
      expect(
        (
          await assigneePage.request.get(`${apiBaseUrl}/api/v1/permissions/me`).then(r => r.json())
        ).permissions,
      ).toContain(PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS)
    } finally {
      await adminContext.close()
      await assigneeContext.close()
    }
  })
})
