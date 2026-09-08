import type { Page } from '@playwright/test'
import {
  createCampaignFixture,
  mockEmployeesListResponse,
  mockPermissions,
  mockSession,
  type CampaignFixture,
  validCampaignFormInput,
  type CampaignCompletionFixture,
} from './fixtures'

const campaignsListPath = /\/api\/v1\/campaigns$/
const campaignDetailPath = /\/api\/v1\/campaigns\/[^/]+$/
const campaignCompletionPath = /\/api\/v1\/campaigns\/[^/]+\/completion$/

export const setupCampaignsFlow = async (
  page: Page,
  options?: { activateDelayMs?: number },
) => {
  const campaigns: CampaignFixture[] = []
  const completionByCampaignId = new Map<string, CampaignCompletionFixture>()

  await page.route('**/api/v1/auth/session', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession),
    })
  })

  await page.route('**/api/v1/permissions/me', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPermissions),
    })
  })

  await page.route('**/api/v1/employees**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockEmployeesListResponse),
    })
  })

  await page.route('**/api/v1/campaigns**', async route => {
    const request = route.request()
    const url = request.url()
    const method = request.method()

    if (method === 'GET' && campaignsListPath.test(url)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(campaigns),
      })
      return
    }

    if (method === 'GET' && campaignCompletionPath.test(url)) {
      const segments = url.split('/')
      const campaignId = segments[segments.length - 2] ?? ''
      const campaign = campaigns.find(entry => entry.id === campaignId)
      if (!campaign) {
        await route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not found' }) })
        return
      }
      if (campaign.status !== 'active') {
        await route.fulfill({
          status: 409,
          body: JSON.stringify({
            message: 'Completion is only available for active campaigns',
          }),
        })
        return
      }
      const completion =
        completionByCampaignId.get(campaignId) ?? { recipients: [] }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(completion),
      })
      return
    }

    if (method === 'GET' && campaignDetailPath.test(url)) {
      const campaignId = url.split('/').pop() ?? ''
      const campaign = campaigns.find(entry => entry.id === campaignId)
      await route.fulfill({
        status: campaign ? 200 : 404,
        contentType: 'application/json',
        body: JSON.stringify(
          campaign ?? { message: `Campaign ${campaignId} not found` },
        ),
      })
      return
    }

    if (method === 'POST' && campaignsListPath.test(url)) {
      const input = request.postDataJSON() as typeof validCampaignFormInput
      const created = createCampaignFixture({
        id: `campaign-${campaigns.length + 1}`,
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      campaigns.unshift(created)
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(created),
      })
      return
    }

    if (method === 'POST' && /\/activate$/.test(url)) {
      const segments = url.split('/')
      const campaignId = segments[segments.length - 2] ?? ''
      const campaign = campaigns.find(entry => entry.id === campaignId)
      if (!campaign) {
        await route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not found' }) })
        return
      }
      if (campaign.status !== 'draft') {
        await route.fulfill({
          status: 409,
          body: JSON.stringify({ message: 'Only draft campaigns can be activated' }),
        })
        return
      }
      if (options?.activateDelayMs) {
        await new Promise(resolve => setTimeout(resolve, options.activateDelayMs))
      }
      campaign.status = 'active'
      campaign.updatedAt = new Date().toISOString()
      if (!completionByCampaignId.has(campaignId)) {
        completionByCampaignId.set(campaignId, { recipients: [] })
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(campaign),
      })
      return
    }

    if (method === 'PUT' && /\/audience$/.test(url)) {
      const segments = url.split('/')
      const campaignId = segments[segments.length - 2] ?? ''
      const campaign = campaigns.find(entry => entry.id === campaignId)
      if (!campaign) {
        await route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not found' }) })
        return
      }
      const audience = request.postDataJSON() as CampaignFixture['audience']
      campaign.audience = audience
      campaign.updatedAt = new Date().toISOString()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(campaign),
      })
      return
    }

    await route.fallback()
  })

  return { campaigns, completionByCampaignId }
}

export { validCampaignFormInput }
