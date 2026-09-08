import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const subjectEmployeeId = '11111111-1111-4111-8111-111111111102'
const colleagueOneId = '22222222-2222-4222-8222-222222222201'
const colleagueTwoId = '33333333-3333-4333-8333-333333333301'
const colleagueThreeId = '44444444-4444-4444-8444-444444444401'
const campaignId = '55555555-5555-4555-8555-555555555501'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${subjectEmployeeId}/profile`
const employeesListUrl = `${apiBaseUrl}/api/v1/employees?page=1&pageSize=100`

const ppProfile = {
  employeeId: subjectEmployeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'PP',
    sections: {
      S8: 'RW',
      S1: 'RW',
    },
  },
  sections: {
    S1: {
      accessLevel: 'RW',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S8: {
      accessLevel: 'RW',
      data: { records: [] },
    },
  },
}

const projectLineProfile = {
  ...ppProfile,
  audience: {
    role: 'ProjectLine',
    sections: ppProfile.audience.sections,
  },
}

const reportingLineProfile = {
  ...ppProfile,
  audience: {
    role: 'ReportingLine',
    sections: ppProfile.audience.sections,
  },
}

const fullAccessProfile = {
  ...ppProfile,
  audience: {
    role: 'FullAccess',
    sections: ppProfile.audience.sections,
  },
}

const employeesList = {
  fields: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      filterable: true,
      sortable: true,
    },
  ],
  rows: [
    {
      employeeId: subjectEmployeeId,
      cells: { name: 'Anton Savchenko' },
    },
    {
      employeeId: colleagueOneId,
      cells: { name: 'Colleague One' },
    },
    {
      employeeId: colleagueTwoId,
      cells: { name: 'Colleague Two' },
    },
    {
      employeeId: colleagueThreeId,
      cells: { name: 'Colleague Three' },
    },
  ],
  total: 4,
  page: 1,
  pageSize: 100,
}

const createdCampaign = {
  id: campaignId,
  title: 'Feedback request: Anton Savchenko',
  description: 'Request feedback about Anton Savchenko from selected colleagues.',
  purpose: 'Collect feedback about Anton Savchenko via the linked external form.',
  link: 'https://forms.example.com/feedback',
  dueDate: '2026-12-31',
  status: 'draft',
  creator: { id: 'author-1', displayName: 'People Partner' },
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
  audience: {
    filters: [],
    addedEmployeeIds: [colleagueOneId, colleagueTwoId, colleagueThreeId],
    excludedEmployeeIds: [],
  },
}

const stubCommonProfileFixtures = async (
  page: import('@playwright/test').Page,
  stubNetworkCall: (spec: import('./shared/network-fixture').StubSpec) => Promise<void>,
  profileBody: typeof ppProfile,
) => {
  await setupAuthApi(page, { authenticated: true })
  await stubNetworkCall({
    url: `${apiBaseUrl}/api/v1/permissions/me`,
    body: { permissions: [] },
  })
  await stubNetworkCall({
    url: profileUrl,
    body: profileBody,
  })
  await stubNetworkCall({
    url: employeesListUrl,
    body: employeesList,
  })
}

test.describe('Request feedback campaign flow', () => {
  test('PP creates a draft campaign with named colleagues and navigates to detail', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await stubCommonProfileFixtures(page, stubNetworkCall, ppProfile)

    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/campaigns`,
      method: 'POST',
      body: createdCampaign,
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/campaigns/${campaignId}/audience`,
      method: 'PUT',
      body: createdCampaign,
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/campaigns/${campaignId}`,
      method: 'GET',
      body: createdCampaign,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${subjectEmployeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('feedback-request-action')).toBeVisible()
    await page.getByTestId('feedback-request-action').click()

    await expect(page.getByTestId('request-feedback-title')).toHaveValue(
      'Feedback request: Anton Savchenko',
    )
    await expect(
      page.getByTestId(`request-feedback-colleague-${subjectEmployeeId}`),
    ).toHaveCount(0)

    await page.getByTestId(`request-feedback-colleague-${colleagueOneId}`).click()
    await page.getByTestId(`request-feedback-colleague-${colleagueTwoId}`).click()
    await page.getByTestId(`request-feedback-colleague-${colleagueThreeId}`).click()
    await page.getByTestId('request-feedback-link').fill('https://forms.example.com/feedback')
    await page.getByTestId('request-feedback-due-date').fill('2026-12-31')

    const createRequestPromise = page.waitForRequest(
      request =>
        request.url().includes('/api/v1/campaigns') &&
        request.method() === 'POST' &&
        !request.url().includes('/audience'),
    )
    const audienceRequestPromise = page.waitForRequest(
      request =>
        request.url().includes(`/api/v1/campaigns/${campaignId}/audience`) &&
        request.method() === 'PUT',
    )

    await page.getByTestId('request-feedback-submit').click()
    const createRequest = await createRequestPromise
    const audienceRequest = await audienceRequestPromise

    expect(createRequest.postDataJSON()).toMatchObject({
      title: 'Feedback request: Anton Savchenko',
      link: 'https://forms.example.com/feedback',
      dueDate: '2026-12-31',
    })
    expect(audienceRequest.postDataJSON()).toEqual({
      filters: [],
      addedEmployeeIds: [colleagueOneId, colleagueTwoId, colleagueThreeId],
      excludedEmployeeIds: [],
    })

    await expect(page).toHaveURL(new RegExp(`/campaigns/${campaignId}$`))
    await expect(page.getByTestId('campaign-detail-title')).toHaveText(
      'Feedback request: Anton Savchenko',
    )
  })

  test('ProjectLine-only viewer does not see Request feedback action', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await stubCommonProfileFixtures(page, stubNetworkCall, projectLineProfile)

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${subjectEmployeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('feedback-request-action')).toHaveCount(0)
  })

  test('FullAccess viewer does not see Request feedback action', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await stubCommonProfileFixtures(page, stubNetworkCall, fullAccessProfile)

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${subjectEmployeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('feedback-request-action')).toHaveCount(0)
  })

  test('ReportingLine viewer sees Request feedback action', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await stubCommonProfileFixtures(page, stubNetworkCall, reportingLineProfile)

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${subjectEmployeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('feedback-request-action')).toBeVisible()
  })

  test('compare mode hides Request feedback action', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await stubCommonProfileFixtures(page, stubNetworkCall, ppProfile)

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${subjectEmployeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('feedback-request-action')).toBeVisible()
    await page.getByTestId('feedback-view-mode-compare').click()
    await expect(page.getByTestId('feedback-request-action')).toHaveCount(0)
  })

  test('navigates to campaign detail when audience save fails after create', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await stubCommonProfileFixtures(page, stubNetworkCall, ppProfile)

    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/campaigns`,
      method: 'POST',
      body: createdCampaign,
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/campaigns/${campaignId}/audience`,
      method: 'PUT',
      status: 400,
      body: { invalidEmployeeIds: [colleagueOneId] },
    })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/campaigns/${campaignId}`,
      method: 'GET',
      body: createdCampaign,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${subjectEmployeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-request-action').click()
    await page.getByTestId(`request-feedback-colleague-${colleagueOneId}`).click()
    await page.getByTestId('request-feedback-link').fill('https://forms.example.com/feedback')
    await page.getByTestId('request-feedback-due-date').fill('2026-12-31')

    const audienceRequest = interceptNetworkCall({
      url: `${apiBaseUrl}/api/v1/campaigns/${campaignId}/audience`,
      method: 'PUT',
    })

    await page.getByTestId('request-feedback-submit').click()
    const audienceCall = await audienceRequest.settled

    expect(audienceCall.status).toBe(400)
    await expect(page).toHaveURL(new RegExp(`/campaigns/${campaignId}$`))
  })

  test('submit stays blocked with zero colleagues selected', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await stubCommonProfileFixtures(page, stubNetworkCall, ppProfile)

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${subjectEmployeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-request-action').click()
    await page.getByTestId('request-feedback-link').fill('https://forms.example.com/feedback')
    await page.getByTestId('request-feedback-due-date').fill('2026-12-31')
    await page.getByTestId('request-feedback-submit').click()

    await expect(page.getByText('Select at least one colleague.')).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`/employees/${subjectEmployeeId}$`))
  })
})
