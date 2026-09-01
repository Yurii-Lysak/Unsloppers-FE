import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { expectSectionAbsent } from './shared/selectors'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111102'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`

const pmProfileWithGate = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'ProjectLine',
    sections: {
      S7: 'R',
      S1: 'RW',
    },
  },
  sections: {
    S1: {
      accessLevel: 'RW',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S7: {
      accessLevel: 'R',
      data: {
        notes: [
          {
            id: 'note-visible-pm',
            content: 'Shared with PM',
            author: { id: 'author-1', displayName: 'People Partner' },
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        hasHiddenNotes: true,
      },
    },
  },
}

const pmProfileWithEmptyGate = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'ProjectLine',
    sections: {
      S7: 'R',
      S1: 'RW',
    },
  },
  sections: {
    S1: {
      accessLevel: 'RW',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S7: {
      accessLevel: 'R',
      data: {
        notes: [],
        hasHiddenNotes: true,
      },
    },
  },
}

const rwProfileWithToggles = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'PP',
    sections: {
      S7: 'RW',
      S1: 'RW',
    },
  },
  sections: {
    S1: {
      accessLevel: 'RW',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S7: {
      accessLevel: 'RW',
      data: {
        notes: [
          {
            id: 'note-rw-1',
            content: 'Private note',
            visibleForEmployee: false,
            visibleForPm: false,
            author: { id: 'author-1', displayName: 'People Partner' },
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
      S7: 'none',
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

test.describe('Management notes visibility', () => {
  test('shows PM gate without leaking hidden note content', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: pmProfileWithGate })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s7')).toBeVisible()
    await expect(page.getByTestId('management-notes-gate')).toBeVisible()
    await expect(page.getByTestId('management-notes-gate')).toHaveText(
      'A management note exists here. Not shared with your role.',
    )
    await expect(page.getByText('Shared with PM')).toBeVisible()
    await expect(page.getByTestId('management-note-add-content')).toHaveCount(0)
  })

  test('renders RW visibility toggles for managers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: rwProfileWithToggles })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/employees/${employeeId}/management-notes/note-rw-1`,
      method: 'PATCH',
      body: {
        id: 'note-rw-1',
        content: 'Private note',
        visibleForEmployee: false,
        visibleForPm: true,
        author: { id: 'author-1', displayName: 'People Partner' },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(
      page.getByTestId('management-note-note-rw-1-visible-employee'),
    ).toBeVisible()
    await expect(
      page.getByTestId('management-note-note-rw-1-visible-pm'),
    ).toBeVisible()
    await expect(page.getByTestId('management-notes-gate')).toHaveCount(0)
    await expect(page.getByTestId('management-note-add-content')).toBeVisible()
    await expect(page.getByTestId('management-note-add-visible-employee')).toBeVisible()
    await expect(page.getByTestId('management-note-add-visible-pm')).toBeVisible()

    const patchRequest = page.waitForRequest(
      (request) =>
        request.url().includes(`/management-notes/note-rw-1`) &&
        request.method() === 'PATCH',
    )
    await page.getByTestId('management-note-note-rw-1-visible-pm').click()
    const request = await patchRequest
    expect(request.postDataJSON()).toEqual({ visibleForPm: true })
  })

  test('shows PM gate with empty note list when only hidden notes exist', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: pmProfileWithEmptyGate })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('management-notes-gate')).toBeVisible()
    await expect(page.getByText('No management notes yet.')).toHaveCount(0)
  })

  test('omits S7 for colleague viewers', async ({
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

    await expectSectionAbsent(page, 'S7')
  })
})
