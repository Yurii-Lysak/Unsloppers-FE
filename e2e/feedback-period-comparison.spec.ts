import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'
import { currentCalendarYear, quarterBoundsForYear } from '../src/pages/EmployeeProfilePage/components/FeedbackSection/utils/feedback-period'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111102'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`
const year = currentCalendarYear()

const compareProfile = {
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
            id: 'feedback-q3-2',
            recordedAt: `${year}-08-01`,
            context: 'Mid-Q3 check-in',
            body: 'Continued improvement',
            sharedWithEmployee: false,
            author: { id: 'author-1', displayName: 'People Partner' },
            createdAt: '2026-01-02T00:00:00.000Z',
            updatedAt: '2026-01-02T00:00:00.000Z',
          },
          {
            id: 'feedback-q3-1',
            recordedAt: `${year}-07-15`,
            context: 'Q3 review',
            body: 'Strong delivery in Q3',
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

const selfSharedQ3Profile = {
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
            id: 'feedback-shared-q3',
            recordedAt: `${year}-07-20`,
            context: 'Shared Q3 note',
            body: 'Visible to employee',
            author: { id: 'author-1', displayName: 'Manager' },
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  },
}

test.describe('Feedback period comparison', () => {
  test('compare Q1 vs Q3 shows empty Q1 and populated Q3 columns (P2-006)', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: compareProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()

    const q1 = quarterBoundsForYear(1, year)
    const q3 = quarterBoundsForYear(3, year)

    await expect(page.getByTestId('feedback-period-a-start')).toHaveValue(q1.start)
    await expect(page.getByTestId('feedback-period-a-end')).toHaveValue(q1.end)
    await expect(page.getByTestId('feedback-period-b-start')).toHaveValue(q3.start)
    await expect(page.getByTestId('feedback-period-b-end')).toHaveValue(q3.end)

    await expect(page.getByTestId('feedback-compare-column-a')).toBeVisible()
    await expect(page.getByTestId('feedback-compare-column-b')).toBeVisible()
    await expect(page.getByTestId('feedback-compare-empty-a')).toBeVisible()
    await expect(page.getByTestId('feedback-compare-record-feedback-q3-1')).toBeVisible()
    await expect(page.getByTestId('feedback-compare-record-feedback-q3-2')).toBeVisible()
    await expect(
      page.locator('[data-testid="feedback-compare-column-b"] li'),
    ).toHaveText([/Strong delivery in Q3/, /Continued improvement/])
    await expect(page.getByTestId('feedback-add-body')).toHaveCount(0)
  })

  test('compare mode hides write controls for Self shared subset', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: selfSharedQ3Profile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()

    await expect(page.getByTestId('feedback-compare-empty-a')).toBeVisible()
    await expect(
      page.getByTestId('feedback-compare-record-feedback-shared-q3'),
    ).toBeVisible()
    await expect(page.getByText('Visible to employee')).toBeVisible()
    await expect(page.getByTestId('feedback-add-body')).toHaveCount(0)
  })

  test('switching back to list restores add form and server-ordered list', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: compareProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()
    await expect(page.getByTestId('feedback-add-body')).toHaveCount(0)

    await page.getByTestId('feedback-view-mode-list').click()
    await expect(page.getByTestId('feedback-add-body')).toBeVisible()
    await expect(
      page.locator('li[data-testid^="feedback-record-feedback-q3-"]'),
    ).toHaveText([/Continued improvement/, /Strong delivery in Q3/])
  })

  test('invalid period shows validation and hides compare columns', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: compareProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()
    await page.getByTestId('feedback-period-a-start').fill(`${year}-12-31`)
    await page.getByTestId('feedback-period-a-end').fill(`${year}-01-01`)

    await expect(page.getByTestId('feedback-period-a-validation')).toBeVisible()
    await expect(page.getByTestId('feedback-compare-column-a')).toHaveCount(0)
  })

  test('incomplete period shows validation and hides compare columns', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: compareProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()
    await page.getByTestId('feedback-period-b-end').fill('')

    await expect(page.getByTestId('feedback-period-b-validation')).toBeVisible()
    await expect(page.getByTestId('feedback-compare-column-b')).toHaveCount(0)
  })

  test('empty records still shows compare columns with empty-period copy', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    const emptyProfile = {
      ...compareProfile,
      sections: {
        ...compareProfile.sections,
        S8: {
          accessLevel: 'RW',
          data: { records: [] },
        },
      },
    }

    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: emptyProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()

    await expect(page.getByTestId('feedback-compare-empty-a')).toBeVisible()
    await expect(page.getByTestId('feedback-compare-empty-b')).toBeVisible()
    await expect(page.getByTestId('feedback-add-body')).toHaveCount(0)
  })

  test('quarter preset updates the targeted period', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: compareProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()
    await page.getByTestId('feedback-period-b-q2').click()

    const q2 = quarterBoundsForYear(2, year)
    await expect(page.getByTestId('feedback-period-b-start')).toHaveValue(q2.start)
    await expect(page.getByTestId('feedback-period-b-end')).toHaveValue(q2.end)
  })

  test('mode switch preserves period values', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({ url: profileUrl, body: compareProfile })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await page.getByTestId('feedback-view-mode-compare').click()
    await page.getByTestId('feedback-period-b-start').fill(`${year}-04-01`)
    await page.getByTestId('feedback-period-b-end').fill(`${year}-06-30`)

    await page.getByTestId('feedback-view-mode-list').click()
    await page.getByTestId('feedback-view-mode-compare').click()

    await expect(page.getByTestId('feedback-period-b-start')).toHaveValue(
      `${year}-04-01`,
    )
    await expect(page.getByTestId('feedback-period-b-end')).toHaveValue(
      `${year}-06-30`,
    )
  })
})
