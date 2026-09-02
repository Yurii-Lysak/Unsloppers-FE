import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { expectSectionAbsent, testIds } from './shared/selectors'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111102'
const recipientId = '22222222-2222-4222-8222-222222222222'
const token = 'A'.repeat(43)

const managerProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'ReportingLine',
    sections: { S1: 'RW', S9: 'RW' },
  },
  sections: {
    S1: {
      accessLevel: 'RW',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
  },
}

const employeeList = {
  fields: [{ id: 'name', name: 'Name', type: 'text', source: 'builtin', sortable: true, filterable: true }],
  rows: [
    { employeeId: recipientId, cells: { name: 'Mila Kovalenko' } },
    { employeeId, cells: { name: 'Anton Savchenko' } },
  ],
  total: 2,
  page: 1,
  pageSize: 100,
}

const sharedLinkProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'SharedLink',
    sections: { S1: 'R', S9: 'R', S2: 'none' },
  },
  sections: {
    S1: {
      accessLevel: 'R',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S9: { accessLevel: 'R', data: { events: [] } },
  },
}

test.describe('Shared link create and view', () => {
  test('manager creates a link from the profile share dialog', async ({
    page,
    stubNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })

    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`,
      body: managerProfile,
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/employees?page=1&pageSize=100`,
      body: employeeList,
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/employees/${employeeId}/shared-links`,
      method: 'POST',
      status: 201,
      body: { token, url: `/shared-links/${token}` },
    })

    await page.goto(`/employees/${employeeId}`)
    await expect(page.getByTestId('employee-profile-share-button')).toBeVisible()
    await page.getByTestId('employee-profile-share-button').click()
    await expect(page.getByRole('combobox')).toBeEnabled()
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Mila Kovalenko' }).click()
    await page.getByLabel('Career timeline').check()
    await page.getByRole('button', { name: 'Create link' }).click()

    await expect(page.getByTestId('shared-link-created-url')).toContainText(
      `/shared-links/${token}`,
    )
  })

  test('recipient sees only enabled sections on the shared link view', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/shared-links/${token}/profile`,
      body: sharedLinkProfile,
    })

    const consumeRequest = interceptNetworkCall({
      url: `${apiBaseUrl}/api/v1/shared-links/${token}/profile`,
      method: 'GET',
    })

    await page.goto(`/shared-links/${token}`)
    await consumeRequest.settled

    await expect(page.getByTestId(testIds.sharedLink.view)).toBeVisible()
    await expect(page.getByTestId('employee-profile-access-chip')).toContainText(
      'Shared link — sections:',
    )
    await expect(page.getByTestId('profile-section-s1')).toBeVisible()
    await expect(page.getByTestId('profile-section-s9')).toBeVisible()
    await expectSectionAbsent(page, 's2')
  })
})
