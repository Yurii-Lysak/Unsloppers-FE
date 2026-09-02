import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { profileSection } from './shared/selectors'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111103'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`

const selfProfileWithField = {
  employeeId,
  displayName: 'Mila Kovalenko',
  audience: {
    role: 'Self',
    sections: {
      S1: 'R',
      S16: 'R',
    },
  },
  sections: {
    S1: {
      accessLevel: 'R',
      data: { displayName: 'Mila Kovalenko', manager: null, peoplePartner: null },
    },
    S16: {
      accessLevel: 'R',
      data: {
        fields: [{ id: 'field-diet', name: 'Dietary preference', type: 'text' }],
        values: { 'field-diet': 'Vegetarian' },
      },
    },
  },
}

const colleagueProfileWithoutEmployeeField = {
  employeeId,
  displayName: 'Mila Kovalenko',
  audience: {
    role: 'Colleague',
    sections: {
      S1: 'R',
      S10: 'R',
      S11: 'R',
      S16: 'R',
    },
  },
  sections: {
    S1: {
      accessLevel: 'R',
      data: { displayName: 'Mila Kovalenko', manager: null, peoplePartner: null },
    },
    S10: { accessLevel: 'R', status: 'unavailable' },
    S11: { accessLevel: 'R', data: { projects: [] } },
    S16: {
      accessLevel: 'R',
      data: { fields: [], values: {} },
    },
  },
}

const colleagueProfileWithColleagueField = {
  ...colleagueProfileWithoutEmployeeField,
  sections: {
    ...colleagueProfileWithoutEmployeeField.sections,
    S16: {
      accessLevel: 'R',
      data: {
        fields: [{ id: 'field-nick', name: 'Nickname', type: 'text' }],
        values: { 'field-nick': 'Sam' },
      },
    },
  },
}

const selfProfileWithFormattedFields = {
  ...selfProfileWithField,
  sections: {
    ...selfProfileWithField.sections,
    S16: {
      accessLevel: 'R',
      data: {
        fields: [
          { id: 'field-remote', name: 'Remote eligible', type: 'boolean' },
          { id: 'field-perks', name: 'Perks', type: 'multi_select' },
          { id: 'field-snacks', name: 'Preferred snacks', type: 'multi_select' },
          { id: 'field-office', name: 'Preferred office', type: 'select' },
          { id: 'field-start', name: 'Start date', type: 'date' },
          { id: 'field-unset', name: 'Not filled in yet', type: 'text' },
        ],
        values: {
          'field-remote': true,
          'field-perks': ['Gym', 'Parking'],
          'field-snacks': [],
          'field-office': 'Kyiv',
          'field-start': '2024-06-15',
          // 'field-unset' intentionally absent — AD-6 lazy-unset (never-set).
        },
      },
    },
  },
}

test.describe('Per-field custom field visibility', () => {
  test('shows an employee-visibility field on Self profile', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: selfProfileWithField })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(profileSection(page, 's16')).toBeVisible()
    await expect(page.getByTestId('custom-field-field-diet')).toBeVisible()
    await expect(page.getByText('Dietary preference')).toBeVisible()
    await expect(page.getByText('Vegetarian')).toBeVisible()
  })

  test('hides the employee-visibility field entirely from a Colleague viewer', async ({
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
      body: colleagueProfileWithoutEmployeeField,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    // S16 renders (a Colleague may see colleague-visible fields, CAP-2) but
    // carries no trace of the employee-visibility field or its value.
    await expect(profileSection(page, 's16')).toBeVisible()
    await expect(page.getByTestId('custom-field-field-diet')).toHaveCount(0)
    await expect(page.getByText('Dietary preference')).toHaveCount(0)
    await expect(page.getByText('Vegetarian')).toHaveCount(0)
    await expect(page.getByText('No custom fields to show.')).toBeVisible()
  })

  test('shows a colleague-visibility field to a Colleague viewer (CAP-2)', async ({
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
      body: colleagueProfileWithColleagueField,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(profileSection(page, 's16')).toBeVisible()
    await expect(page.getByTestId('custom-field-field-nick')).toBeVisible()
    await expect(page.getByText('Nickname')).toBeVisible()
    await expect(page.getByText('Sam')).toBeVisible()
  })

  test('formats boolean, multi_select (populated and empty), and never-set values', async ({
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
      body: selfProfileWithFormattedFields,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(profileSection(page, 's16')).toBeVisible()

    // boolean -> 'Yes'
    await expect(page.getByTestId('custom-field-field-remote-value')).toHaveText(
      'Yes',
    )
    // multi_select with values -> joined list
    await expect(page.getByTestId('custom-field-field-perks-value')).toHaveText(
      'Gym, Parking',
    )
    // multi_select stored as [] -> 'None selected', distinct from never-set
    await expect(page.getByTestId('custom-field-field-snacks-value')).toHaveText(
      'None selected',
    )
    // select -> raw stored option string
    await expect(page.getByTestId('custom-field-field-office-value')).toHaveText(
      'Kyiv',
    )
    // date -> backend-normalized YYYY-MM-DD string
    await expect(page.getByTestId('custom-field-field-start-value')).toHaveText(
      '2024-06-15',
    )
    // field present in `fields` but absent from `values` -> 'Not set'
    await expect(page.getByTestId('custom-field-field-unset-value')).toHaveText(
      'Not set',
    )
  })
})
