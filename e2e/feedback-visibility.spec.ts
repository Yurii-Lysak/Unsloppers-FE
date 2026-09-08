import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { expectSectionAbsent } from './shared/selectors'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111102'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`

const rwProfileWithToggle = {
  employeeId,
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
      data: {
        records: [
          {
            id: 'feedback-rw-1',
            recordedAt: '2026-07-01',
            context: 'Q3 project retrospective',
            body: 'Private feedback',
            sharedWithEmployee: false,
            author: { id: 'author-1', displayName: 'People Partner' },
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  },
}

const selfProfileSharedOnly = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'Self',
    sections: {
      S8: 'R',
      S1: 'R',
    },
  },
  sections: {
    S1: {
      accessLevel: 'R',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S8: {
      accessLevel: 'R',
      data: {
        records: [
          {
            id: 'feedback-shared-1',
            recordedAt: '2026-07-01',
            context: 'Shared review',
            body: 'Visible to me',
            author: { id: 'author-1', displayName: 'Manager' },
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  },
}

const colleagueProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'Colleague',
    sections: {
      S1: 'R',
      S10: 'R',
      S11: 'R',
      S8: 'none',
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

test.describe('Feedback visibility', () => {
  test('renders RW shared-with-employee toggle for managers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: rwProfileWithToggle })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/employees/${employeeId}/feedbacks/feedback-rw-1`,
      method: 'PATCH',
      body: {
        id: 'feedback-rw-1',
        recordedAt: '2026-07-01',
        context: 'Q3 project retrospective',
        body: 'Private feedback',
        sharedWithEmployee: true,
        author: { id: 'author-1', displayName: 'People Partner' },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s8')).toBeVisible()
    await expect(
      page.getByTestId('feedback-record-feedback-rw-1-shared-employee'),
    ).toBeVisible()
    await expect(page.getByTestId('feedback-add-body')).toBeVisible()

    const patchRequest = page.waitForRequest(
      request =>
        request.url().includes('/feedbacks/feedback-rw-1') &&
        request.method() === 'PATCH',
    )
    await page.getByTestId('feedback-record-feedback-rw-1-shared-employee').click()
    const request = await patchRequest
    expect(request.postDataJSON()).toEqual({ sharedWithEmployee: true })
  })

  test('shows only shared feedback for Self viewers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: selfProfileSharedOnly })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s8')).toBeVisible()
    await expect(page.getByText('Visible to me')).toBeVisible()
    await expect(page.getByTestId('feedback-add-body')).toHaveCount(0)
  })

  test('omits S8 for colleague viewers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: colleagueProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expectSectionAbsent(page, 's8')
  })
})
