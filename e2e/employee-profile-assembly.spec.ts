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
