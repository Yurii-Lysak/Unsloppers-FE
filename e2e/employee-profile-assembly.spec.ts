import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111102'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`

const colleagueProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'Colleague',
    sections: {
      S1: 'R',
      S10: 'R',
      S11: 'R',
      S2: 'none',
    },
  },
  sections: {
    S1: {
      accessLevel: 'R',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S10: { accessLevel: 'R', status: 'unavailable' },
    S11: { accessLevel: 'R', data: { projects: [] } },
  },
}

const managerProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'ReportingLine',
    sections: {
      S1: 'RW',
      S6: 'RW',
      S9: 'RW',
      S10: 'R',
    },
  },
  sections: {
    S1: {
      accessLevel: 'RW',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S6: { accessLevel: 'RW', status: 'unavailable' },
    S9: { accessLevel: 'RW', data: { events: [] } },
    S10: { accessLevel: 'R', status: 'unavailable' },
  },
}

test.describe('Employee profile assembly', () => {
  test('renders only Colleague-granted section cards', async ({
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
      url: profileUrl,
      body: colleagueProfile,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('employee-profile-title')).toHaveText('Anton Savchenko')
    await expect(page.getByTestId('employee-profile-access-chip')).toBeVisible()
    await expect(page.getByTestId('profile-section-s1')).toBeVisible()
    await expect(page.getByTestId('profile-section-s10')).toBeVisible()
    await expect(page.getByTestId('profile-section-s11')).toBeVisible()
    await expect(page.getByTestId('profile-section-s9')).toHaveCount(0)
  })

  test('renders additional sections for ReportingLine viewers', async ({
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
      url: profileUrl,
      body: managerProfile,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s1')).toBeVisible()
    await expect(page.getByTestId('profile-section-s6')).toBeVisible()
    await expect(page.getByTestId('profile-section-s9')).toBeVisible()
    await expect(page.getByTestId('profile-section-s11')).toHaveCount(0)
  })
})
