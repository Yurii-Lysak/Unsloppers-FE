import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111102'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`

const stubRiskRecord = (
  id: string,
  level: 'low' | 'need_attention' | 'medium' | 'high' | 'leaver',
  recordedAt: string,
) => ({
  id,
  level,
  description: 'Assessment',
  details: 'Details',
  recordedAt,
  author: { id: 'author-1', displayName: 'Manager' },
  createdAt: `${recordedAt}T10:00:00.000Z`,
})

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

const selfProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'Self',
    sections: {
      S1: 'R',
      S4: 'R',
    },
  },
  sections: {
    S1: {
      accessLevel: 'R',
      data: { displayName: 'Anton Savchenko', manager: null, peoplePartner: null },
    },
    S4: {
      accessLevel: 'R',
      data: {
        grade: 'L4',
        position: 'Software Engineer',
        seniority: 'Senior',
        employmentType: 'Full-time',
        englishLevel: null,
        probationStatus: null,
        contractType: null,
      },
    },
  },
}

const managerProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'ReportingLine',
    sections: {
      S1: 'RW',
      S4: 'RW',
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
    S4: {
      accessLevel: 'RW',
      data: {
        grade: 'L4',
        position: 'Software Engineer',
        seniority: 'Senior',
        employmentType: 'Full-time',
        englishLevel: null,
        probationStatus: null,
        contractType: null,
      },
    },
    S6: {
      accessLevel: 'RW',
      data: {
        records: [
          stubRiskRecord('risk-2', 'medium', '2026-01-04'),
          stubRiskRecord('risk-1', 'low', '2026-01-01'),
        ],
        currentLevel: 'medium',
        trend: 'up',
      },
    },
    S9: { accessLevel: 'RW', data: { events: [] } },
    S10: { accessLevel: 'R', status: 'unavailable' },
  },
}

test.describe('Employee profile assembly', () => {
  test('renders S4 employment details read-only for Self viewers', async ({
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
      body: selfProfile,
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s4')).toBeVisible()
    await expect(page.getByTestId('profile-section-s4')).toContainText('Employment details')
    await expect(page.getByTestId('employment-field-grade')).toHaveText('L4')
    await expect(page.getByTestId('employment-field-position')).toHaveText('Software Engineer')
    await expect(page.getByTestId('employment-field-seniority')).toHaveText('Senior')
    await expect(page.getByTestId('employment-field-employmentType')).toHaveText('Full-time')
    await expect(page.getByTestId('employment-field-englishLevel')).toHaveText('Not set')
    await expect(page.getByTestId('employment-field-probationStatus')).toHaveText('Not set')
    await expect(page.getByTestId('employment-field-contractType')).toHaveText('Not set')
    await expect(page.locator('[data-testid^="employment-field-"]')).toHaveCount(7)
    await expect(page.getByRole('button', { name: /save/i })).toHaveCount(0)
  })

  test('renders S4 employment details read-only for ReportingLine viewers with RW access', async ({
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

    await expect(page.getByTestId('profile-section-s4')).toBeVisible()
    await expect(page.getByTestId('employment-field-grade')).toHaveText('L4')
    await expect(page.getByTestId('employment-field-englishLevel')).toHaveText('Not set')
    await expect(page.locator('[data-testid^="employment-field-"]')).toHaveCount(7)
    await expect(page.getByTestId('profile-section-s4').locator('input')).toHaveCount(0)
    await expect(page.getByTestId('profile-section-s4').getByRole('button')).toHaveCount(0)
  })

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
    await expect(page.getByTestId('risks-section')).toBeVisible()
    await expect(page.getByTestId('risk-trend-up')).toBeVisible()
    await expect(page.getByTestId('profile-section-s9')).toBeVisible()
    await expect(page.getByTestId('profile-section-s11')).toHaveCount(0)
  })

  test('renders down trend arrow in success color for improving risk', async ({
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
      body: {
        ...managerProfile,
        sections: {
          ...managerProfile.sections,
          S6: {
            accessLevel: 'RW',
            data: {
              records: [
                stubRiskRecord('risk-2', 'low', '2026-01-04'),
                stubRiskRecord('risk-1', 'high', '2026-01-01'),
              ],
              currentLevel: 'low',
              trend: 'down',
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    const downArrow = page.getByTestId('risk-trend-down')
    await expect(downArrow).toBeVisible()
    await expect(downArrow).toHaveClass(/text-success/)
    await expect(page.getByTestId('risk-trend-up')).toHaveCount(0)
  })

  test('hides trend arrow when trend is flat', async ({
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
      body: {
        ...managerProfile,
        sections: {
          ...managerProfile.sections,
          S6: {
            accessLevel: 'RW',
            data: {
              records: [
                stubRiskRecord('risk-2', 'medium', '2026-01-04'),
                stubRiskRecord('risk-1', 'medium', '2026-01-01'),
              ],
              currentLevel: 'medium',
              trend: 'flat',
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('risks-current-level')).toBeVisible()
    await expect(page.getByTestId('risk-trend-up')).toHaveCount(0)
    await expect(page.getByTestId('risk-trend-down')).toHaveCount(0)
  })

  test('renders S10 manage-leave link alongside leave rows for Self viewers', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S10: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S10: {
            accessLevel: 'R',
            data: {
              availability: 'ok',
              leaves: [
                {
                  type: 'vacation',
                  startDate: '2026-08-25',
                  endDate: '2026-08-29',
                  approvalState: 'approved',
                },
              ],
              manageLeaveUrl: 'https://timetracker.bootcamp.example/manage-leave',
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s10')).toContainText(
      'Leaves and absences',
    )
    await expect(page.getByText('2026-08-25 — 2026-08-29')).toBeVisible()
    await expect(page.getByTestId('leaves-manage-link')).toBeVisible()
  })

  test('renders S10 manage-leave link for Self viewers', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S10: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S10: {
            accessLevel: 'R',
            data: {
              availability: 'ok',
              leaves: [],
              manageLeaveUrl: 'https://timetracker.bootcamp.example/manage-leave',
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    const manageLink = page.getByTestId('leaves-manage-link')
    await expect(manageLink).toBeVisible()
    await expect(manageLink).toHaveAttribute(
      'href',
      'https://timetracker.bootcamp.example/manage-leave',
    )
    await expect(manageLink).toHaveText('Manage leave in TimeTracker')
  })

  test('renders S10 unavailable state distinctly from empty leaves', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S10: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S10: {
            accessLevel: 'R',
            data: {
              availability: 'unavailable',
              leaves: [],
              manageLeaveUrl: null,
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('leaves-unavailable')).toBeVisible()
    await expect(page.getByTestId('leaves-unavailable')).toHaveText(
      'Leave data is temporarily unavailable.',
    )
    await expect(page.getByTestId('leaves-manage-link')).toHaveCount(0)
  })

  test('renders S11 PM/DM/period for enriched project entries', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S11: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S11: {
            accessLevel: 'R',
            data: {
              projects: [
                {
                  name: 'People Management Platform',
                  pm: 'Pat Manager',
                  dm: null,
                  startDate: '2026-01-01',
                  endDate: null,
                },
              ],
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s11')).toContainText('Projects')

    const projectEntry = page.getByTestId('project-entry-0')
    await expect(projectEntry).toContainText('People Management Platform')
    await expect(projectEntry).toContainText('Project manager: Pat Manager')
    await expect(projectEntry).toContainText('Delivery manager: Not set')
    await expect(projectEntry).toContainText('Period: 2026-01-01 — Ongoing')
  })

  test('renders S11 period with concrete endDate', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S11: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S11: {
            accessLevel: 'R',
            data: {
              projects: [
                {
                  name: 'Ended Project',
                  pm: 'Pat Manager',
                  dm: 'Dana DM',
                  startDate: '2026-01-01',
                  endDate: '2026-06-30',
                },
              ],
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('project-entry-0')).toContainText(
      'Period: 2026-01-01 — 2026-06-30',
    )
  })

  test('renders S11 name-only entries for Colleague viewers', async ({
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
      body: {
        ...colleagueProfile,
        sections: {
          ...colleagueProfile.sections,
          S11: {
            accessLevel: 'R',
            data: {
              projects: [{ name: 'People Management Platform' }],
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    const projectEntry = page.getByTestId('project-entry-0')
    await expect(projectEntry).toContainText('People Management Platform')
    await expect(projectEntry).not.toContainText('Project manager:')
    await expect(projectEntry).not.toContainText('Delivery manager:')
    await expect(projectEntry).not.toContainText('Period:')
  })

  test('renders S7 and S8 read-only for Self without create or request controls', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S7: 'R',
            S8: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S7: {
            accessLevel: 'R',
            data: {
              notes: [
                {
                  id: 'note-visible',
                  content: 'Flagged management note',
                  author: { id: 'mgr-1', displayName: 'Pat Manager' },
                  createdAt: '2026-01-01T10:00:00.000Z',
                  updatedAt: '2026-01-01T10:00:00.000Z',
                },
              ],
            },
          },
          S8: {
            accessLevel: 'R',
            data: {
              records: [
                {
                  id: 'feedback-shared',
                  recordedAt: '2026-02-01',
                  context: 'Shared review',
                  body: 'Shared feedback body',
                  author: { id: 'mgr-1', displayName: 'Pat Manager' },
                  createdAt: '2026-02-01T10:00:00.000Z',
                  updatedAt: '2026-02-01T10:00:00.000Z',
                },
              ],
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s7')).toBeVisible()
    await expect(page.getByTestId('management-notes-section')).toContainText(
      'Flagged management note',
    )
    await expect(page.getByTestId('management-note-note-visible')).toBeVisible()
    await expect(page.getByTestId('management-note-add-content')).toHaveCount(0)

    await expect(page.getByTestId('profile-section-s8')).toBeVisible()
    await expect(page.getByTestId('feedback-section')).toContainText('Shared review')
    await expect(page.getByTestId('feedback-record-feedback-shared')).toBeVisible()
    await expect(page.getByTestId('feedback-request-action')).toHaveCount(0)
  })

  test('renders S14 for Self with mark complete and updates after completion', async ({
    page,
    stubNetworkCall,
  }) => {
    const openItemId = 'action-item-open'
    const completeUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/action-items/${openItemId}/complete`
    let profileBody = {
      ...selfProfile,
      audience: {
        role: 'Self',
        sections: {
          ...selfProfile.audience.sections,
          S14: 'R',
        },
      },
      sections: {
        ...selfProfile.sections,
        S14: {
          accessLevel: 'R',
          data: {
            items: [
              {
                id: openItemId,
                title: 'Follow up on goals',
                description: 'Discuss progress in the next 1:1',
                dueDate: '2026-01-01',
                status: 'open',
                source: 'manual',
                author: { id: 'mgr-1', displayName: 'Pat Manager' },
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z',
                isOverdue: true,
              },
            ],
          },
        },
      },
    }

    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await page.route(profileUrl, async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, json: profileBody })
        return
      }
      await route.fallback()
    })
    await page.route(completeUrl, async route => {
      profileBody = {
        ...profileBody,
        sections: {
          ...profileBody.sections,
          S14: {
            accessLevel: 'R',
            data: {
              items: [
                {
                  id: openItemId,
                  title: 'Follow up on goals',
                  description: 'Discuss progress in the next 1:1',
                  dueDate: '2026-01-01',
                  status: 'completed',
                  source: 'manual',
                  author: { id: 'mgr-1', displayName: 'Pat Manager' },
                  createdAt: '2026-01-01T10:00:00.000Z',
                  updatedAt: '2026-01-02T10:00:00.000Z',
                  completedAt: '2026-01-02T10:00:00.000Z',
                  isOverdue: false,
                },
              ],
            },
          },
        },
      }
      await route.fulfill({
        status: 200,
        json: {
          id: openItemId,
          title: 'Follow up on goals',
          dueDate: '2026-01-01',
          status: 'completed',
          source: 'manual',
          author: { id: 'mgr-1', displayName: 'Pat Manager' },
          createdAt: '2026-01-01T10:00:00.000Z',
          updatedAt: '2026-01-02T10:00:00.000Z',
          completedAt: '2026-01-02T10:00:00.000Z',
          isOverdue: false,
        },
      })
    })

    await page.goto(`/employees/${employeeId}`)

    await expect(page.getByTestId('profile-section-s14')).toBeVisible()
    await expect(page.getByTestId('action-items-section')).toContainText(
      'Follow up on goals',
    )
    await expect(page.getByTestId('action-items-section')).toContainText('Overdue')
    await expect(page.getByTestId(`action-item-${openItemId}-complete`)).toBeVisible()

    await page.getByTestId(`action-item-${openItemId}-complete`).click()

    await expect(page.getByTestId(`action-item-${openItemId}-complete`)).toHaveCount(0)
    await expect(page.getByTestId(`action-item-${openItemId}`)).toContainText(
      'Completed on',
    )
  })

  test('renders S14 empty state for Self with no assigned items', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S14: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S14: {
            accessLevel: 'R',
            data: { items: [] },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s14')).toBeVisible()
    await expect(page.getByTestId('action-items-section')).toContainText(
      'No action items yet.',
    )
  })

  test('renders cancelled S14 item without mark complete for Self', async ({
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
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S14: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S14: {
            accessLevel: 'R',
            data: {
              items: [
                {
                  id: 'action-item-cancelled',
                  title: 'Cancelled follow-up',
                  dueDate: '2026-02-01',
                  status: 'cancelled',
                  source: 'manual',
                  author: { id: 'mgr-1', displayName: 'Pat Manager' },
                  createdAt: '2026-02-01T10:00:00.000Z',
                  updatedAt: '2026-02-02T10:00:00.000Z',
                  cancelledAt: '2026-02-02T10:00:00.000Z',
                  cancelledReason: 'No longer needed',
                  isOverdue: false,
                },
              ],
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('action-item-action-item-cancelled')).toContainText(
      'Cancelled',
    )
    await expect(page.getByTestId('action-item-action-item-cancelled')).toContainText(
      'Reason: No longer needed',
    )
    await expect(
      page.getByTestId('action-item-action-item-cancelled-complete'),
    ).toHaveCount(0)
  })

  test('shows distinct 409 toast when completing an already completed action item', async ({
    page,
    stubNetworkCall,
  }) => {
    const openItemId = 'action-item-stale-open'
    const completeUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/action-items/${openItemId}/complete`

    await setupAuthApi(page, { authenticated: true })
    await stubNetworkCall({
      url: `${apiBaseUrl}/api/v1/permissions/me`,
      body: { permissions: [] },
    })
    await stubNetworkCall({
      url: profileUrl,
      body: {
        ...selfProfile,
        audience: {
          role: 'Self',
          sections: {
            ...selfProfile.audience.sections,
            S14: 'R',
          },
        },
        sections: {
          ...selfProfile.sections,
          S14: {
            accessLevel: 'R',
            data: {
              items: [
                {
                  id: openItemId,
                  title: 'Stale open item',
                  dueDate: '2026-03-01',
                  status: 'open',
                  source: 'manual',
                  author: { id: 'mgr-1', displayName: 'Pat Manager' },
                  createdAt: '2026-03-01T10:00:00.000Z',
                  updatedAt: '2026-03-01T10:00:00.000Z',
                  isOverdue: false,
                },
              ],
            },
          },
        },
      },
    })
    await page.route(completeUrl, async route => {
      await route.fulfill({
        status: 409,
        json: { message: 'Action item is not open', status: 'completed' },
      })
    })

    await page.goto(`/employees/${employeeId}`)
    await page.getByTestId(`action-item-${openItemId}-complete`).click()

    await expect(page.getByText('This action item is already completed.')).toBeVisible()
  })

  test('renders S14 read-only without mark complete for ReportingLine viewers', async ({
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
      body: {
        ...managerProfile,
        audience: {
          role: 'ReportingLine',
          sections: {
            ...managerProfile.audience.sections,
            S14: 'RW',
          },
        },
        sections: {
          ...managerProfile.sections,
          S14: {
            accessLevel: 'RW',
            data: {
              items: [
                {
                  id: 'action-item-report',
                  title: 'Report action item',
                  dueDate: '2026-03-01',
                  status: 'open',
                  source: 'manual',
                  author: { id: 'mgr-1', displayName: 'Pat Manager' },
                  createdAt: '2026-03-01T10:00:00.000Z',
                  updatedAt: '2026-03-01T10:00:00.000Z',
                  isOverdue: false,
                },
              ],
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s14')).toBeVisible()
    await expect(page.getByTestId('action-item-action-item-report')).toContainText(
      'Report action item',
    )
    await expect(
      page.getByTestId('action-item-action-item-report-complete'),
    ).toHaveCount(0)
  })

  test('renders S14 read-only without mark complete for PeoplePartner viewers', async ({
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
      body: {
        ...managerProfile,
        audience: {
          role: 'PeoplePartner',
          sections: {
            ...managerProfile.audience.sections,
            S14: 'RW',
          },
        },
        sections: {
          ...managerProfile.sections,
          S14: {
            accessLevel: 'RW',
            data: {
              items: [
                {
                  id: 'action-item-pp',
                  title: 'PP-visible action item',
                  dueDate: '2026-04-01',
                  status: 'open',
                  source: 'manual',
                  author: { id: 'mgr-1', displayName: 'Pat Manager' },
                  createdAt: '2026-04-01T10:00:00.000Z',
                  updatedAt: '2026-04-01T10:00:00.000Z',
                  isOverdue: false,
                },
              ],
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('profile-section-s14')).toBeVisible()
    await expect(page.getByTestId('action-item-action-item-pp')).toContainText(
      'PP-visible action item',
    )
    await expect(page.getByTestId('action-item-action-item-pp-complete')).toHaveCount(0)
  })

  test('hides trend arrow when trend is absent on first record', async ({
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
      body: {
        ...managerProfile,
        sections: {
          ...managerProfile.sections,
          S6: {
            accessLevel: 'RW',
            data: {
              records: [stubRiskRecord('risk-1', 'medium', '2026-01-01')],
              currentLevel: 'medium',
            },
          },
        },
      },
    })

    const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
    await page.goto(`/employees/${employeeId}`)
    await profileRequest.settled

    await expect(page.getByTestId('risks-current-level')).toBeVisible()
    await expect(page.getByTestId('risk-trend-up')).toHaveCount(0)
    await expect(page.getByTestId('risk-trend-down')).toHaveCount(0)
  })
})
