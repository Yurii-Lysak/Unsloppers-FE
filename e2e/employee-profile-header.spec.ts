import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testEnv } from './shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl
const employeeId = '11111111-1111-4111-8111-111111111102'
const profileUrl = `${apiBaseUrl}/api/v1/employees/${employeeId}/profile`

const mentorId = '22222222-2222-4222-8222-222222222222'
const managerId = '33333333-3333-4333-8333-333333333333'
const peoplePartnerId = '44444444-4444-4444-8444-444444444444'

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
      data: {
        displayName: 'Anton Savchenko',
        manager: { id: managerId, displayName: 'Alex Kim' },
        peoplePartner: { id: peoplePartnerId, displayName: 'Daniela Voss' },
      },
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
      data: {
        displayName: 'Anton Savchenko',
        manager: { id: managerId, displayName: 'Alex Kim' },
        peoplePartner: { id: peoplePartnerId, displayName: 'Daniela Voss' },
        mentor: { id: mentorId, displayName: 'Mila Kovalenko' },
      },
    },
    S6: { accessLevel: 'RW', status: 'unavailable' },
    S9: { accessLevel: 'RW', data: { events: [] } },
    S10: { accessLevel: 'R', status: 'unavailable' },
  },
}

const projectLineProfile = {
  ...managerProfile,
  audience: {
    role: 'ProjectLine',
    sections: managerProfile.audience.sections,
  },
}

const selfProfile = {
  employeeId,
  displayName: 'Anton Savchenko',
  audience: {
    role: 'Self',
    sections: {
      S1: 'R',
      S10: 'R',
      S11: 'R',
    },
  },
  sections: {
    S1: {
      accessLevel: 'R',
      data: {
        displayName: 'Anton Savchenko',
        manager: { id: managerId, displayName: 'Alex Kim' },
        peoplePartner: { id: peoplePartnerId, displayName: 'Daniela Voss' },
      },
    },
    S10: { accessLevel: 'R', status: 'unavailable' },
    S11: { accessLevel: 'R', data: { projects: [] } },
  },
}

const reportingLineWithoutMentor = {
  ...managerProfile,
  sections: {
    ...managerProfile.sections,
    S1: {
      accessLevel: 'RW',
      data: {
        displayName: 'Anton Savchenko',
        manager: { id: managerId, displayName: 'Alex Kim' },
        peoplePartner: { id: peoplePartnerId, displayName: 'Daniela Voss' },
      },
    },
  },
}

const setupProfilePage = async (
  page: Parameters<Parameters<typeof test>[1]>[0]['page'],
  stubNetworkCall: Parameters<Parameters<typeof test>[1]>[0]['stubNetworkCall'],
  interceptNetworkCall: Parameters<Parameters<typeof test>[1]>[0]['interceptNetworkCall'],
  profileBody: object,
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

  const profileRequest = interceptNetworkCall({ url: profileUrl, method: 'GET' })
  await page.goto(`/employees/${employeeId}`)
  await profileRequest.settled
}

test.describe('Employee profile header relationships', () => {
  test('shows manager and people partner for Colleague viewers without mentor segment', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(
      page,
      stubNetworkCall,
      interceptNetworkCall,
      colleagueProfile,
    )

    const relationships = page.getByTestId('profile-header-relationships')
    await expect(relationships).toBeVisible()
    await expect(relationships).toContainText('Alex Kim')
    await expect(relationships).toContainText('Daniela Voss')
    await expect(relationships).not.toContainText('Mila Kovalenko')
    await expect(relationships).not.toContainText('Mentor:')
    await expect(page.getByRole('link', { name: 'Alex Kim' })).toHaveAttribute(
      'href',
      `/employees/${managerId}`,
    )
  })

  test('shows manager, people partner, and mentor links for ReportingLine viewers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(
      page,
      stubNetworkCall,
      interceptNetworkCall,
      managerProfile,
    )

    const relationships = page.getByTestId('profile-header-relationships')
    await expect(relationships).toBeVisible()
    await expect(relationships).toContainText('Alex Kim')
    await expect(relationships).toContainText('Daniela Voss')
    await expect(relationships).toContainText('Mila Kovalenko')
    await expect(relationships).toContainText('Mentor:')
    await expect(page.getByRole('link', { name: 'Mila Kovalenko' })).toHaveAttribute(
      'href',
      `/employees/${mentorId}`,
    )
  })

  test('shows mentor for ProjectLine viewers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(
      page,
      stubNetworkCall,
      interceptNetworkCall,
      projectLineProfile,
    )

    const relationships = page.getByTestId('profile-header-relationships')
    await expect(relationships).toContainText('Mila Kovalenko')
    await expect(relationships).toContainText('Mentor:')
  })

  test('omits mentor for Self viewers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(page, stubNetworkCall, interceptNetworkCall, selfProfile)

    const relationships = page.getByTestId('profile-header-relationships')
    await expect(relationships).toBeVisible()
    await expect(relationships).not.toContainText('Mentor:')
  })

  test('omits mentor segment when S1 has no mentor for ReportingLine viewers', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(
      page,
      stubNetworkCall,
      interceptNetworkCall,
      reportingLineWithoutMentor,
    )

    const relationships = page.getByTestId('profile-header-relationships')
    await expect(relationships).toBeVisible()
    await expect(relationships).not.toContainText('Mentor:')
  })

  test('omits relationship strip when S1 has no assignees', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(page, stubNetworkCall, interceptNetworkCall, {
      ...colleagueProfile,
      sections: {
        ...colleagueProfile.sections,
        S1: {
          accessLevel: 'R',
          data: {
            displayName: 'Anton Savchenko',
            manager: null,
            peoplePartner: null,
          },
        },
      },
    })

    await expect(page.getByTestId('profile-header-relationships')).toHaveCount(0)
  })

  test('omits relationship strip when S1 is unavailable', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(page, stubNetworkCall, interceptNetworkCall, {
      ...colleagueProfile,
      sections: {
        ...colleagueProfile.sections,
        S1: { accessLevel: 'R', status: 'unavailable' },
      },
    })

    await expect(page.getByTestId('profile-header-relationships')).toHaveCount(0)
    await expect(page.getByTestId('employee-profile-title')).toContainText(
      'Anton Savchenko',
    )
  })

  test('does not duplicate relationship fields inside the S1 section card', async ({
    page,
    stubNetworkCall,
    interceptNetworkCall,
  }) => {
    await setupProfilePage(
      page,
      stubNetworkCall,
      interceptNetworkCall,
      managerProfile,
    )

    const s1Section = page.getByTestId('profile-section-s1')
    await expect(s1Section).toBeVisible()
    await expect(s1Section.getByRole('heading', { name: 'Identity' })).toBeVisible()
    await expect(s1Section).not.toContainText('Alex Kim')
    await expect(s1Section).not.toContainText('Mila Kovalenko')
    await expect(s1Section).not.toContainText('Daniela Voss')
  })
})
