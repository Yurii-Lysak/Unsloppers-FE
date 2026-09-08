import { setupCampaignsFlow, validCampaignFormInput } from './helpers'
import { createCampaignFixture } from './fixtures'
import { expect, test } from '../../shared/merged-fixtures'

test.describe('Campaigns', () => {
  test('shows the empty state and opens the create dialog', async ({ page }) => {
    await setupCampaignsFlow(page)
    await page.goto('/campaigns')

    await expect(page.getByTestId('campaigns-title')).toBeVisible()
    await expect(page.getByTestId('campaigns-empty')).toHaveText('No campaigns yet.')

    await page.getByTestId('campaigns-create').click()
    await expect(page.getByTestId('campaign-form-title')).toBeVisible()
    await expect(page.getByTestId('campaign-form-link')).toBeVisible()
  })

  test('creates a campaign and shows it in the list', async ({ page }) => {
    await setupCampaignsFlow(page)
    await page.goto('/campaigns')

    await page.getByTestId('campaigns-create').click()
    await page.getByTestId('campaign-form-title').fill(validCampaignFormInput.title)
    await page.getByTestId('campaign-form-description').fill(
      validCampaignFormInput.description,
    )
    await page.getByTestId('campaign-form-purpose').fill(validCampaignFormInput.purpose)
    await page.getByTestId('campaign-form-link').fill(validCampaignFormInput.link)
    await page.getByTestId('campaign-form-due-date').fill(validCampaignFormInput.dueDate)

    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByTestId('campaigns-list')).toBeVisible()
    await expect(page.getByTestId('campaigns-empty')).toHaveCount(0)
    await expect(page.getByText(validCampaignFormInput.title)).toBeVisible()
  })

  test('builds and saves a draft campaign audience on the detail page', async ({ page }) => {
    await setupCampaignsFlow(page)
    await page.goto('/campaigns')

    await page.getByTestId('campaigns-create').click()
    await page.getByTestId('campaign-form-title').fill(validCampaignFormInput.title)
    await page.getByTestId('campaign-form-description').fill(
      validCampaignFormInput.description,
    )
    await page.getByTestId('campaign-form-purpose').fill(validCampaignFormInput.purpose)
    await page.getByTestId('campaign-form-link').fill(validCampaignFormInput.link)
    await page.getByTestId('campaign-form-due-date').fill(validCampaignFormInput.dueDate)
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByTestId('campaigns-list').locator('button').first().click()
    await expect(page.getByTestId('campaign-detail-title')).toHaveText(
      validCampaignFormInput.title,
    )
    await expect(page.getByTestId('campaign-audience-builder')).toBeVisible()
    await expect(page.getByTestId('directory-filter-department')).toBeVisible()

    await page.getByTestId('directory-filter-department').click()
    await page.locator('#filter-value-department').click()
    await page.getByRole('option', { name: 'Engineering' }).click()
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(page.getByTestId('campaign-audience-count')).toHaveText(
      '2 recipients in preview',
    )

    await page.getByTestId('campaign-audience-remove-emp-bob').click()
    await expect(page.getByTestId('campaign-audience-count')).toHaveText(
      '1 recipients in preview',
    )

    await page.getByTestId('campaign-audience-add-select').selectOption('emp-carol')
    await expect(page.getByTestId('campaign-audience-count')).toHaveText(
      '2 recipients in preview',
    )

    await page.getByTestId('campaign-audience-save').click()
    await expect(page.getByText('Audience saved.')).toBeVisible()
    await expect(page.getByTestId('campaign-audience-row-emp-alice')).toBeVisible()
    await expect(page.getByTestId('campaign-audience-row-emp-carol')).toBeVisible()
    await expect(page.getByTestId('campaign-audience-row-emp-bob')).toHaveCount(0)
  })

  test('activates a draft campaign and locks the detail page', async ({ page }) => {
    await setupCampaignsFlow(page)
    await page.goto('/campaigns')

    await page.getByTestId('campaigns-create').click()
    await page.getByTestId('campaign-form-title').fill(validCampaignFormInput.title)
    await page.getByTestId('campaign-form-description').fill(
      validCampaignFormInput.description,
    )
    await page.getByTestId('campaign-form-purpose').fill(validCampaignFormInput.purpose)
    await page.getByTestId('campaign-form-link').fill(validCampaignFormInput.link)
    await page.getByTestId('campaign-form-due-date').fill(validCampaignFormInput.dueDate)
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByTestId('campaigns-list').locator('button').first().click()
    await expect(page.getByTestId('campaign-detail-title')).toHaveText(
      validCampaignFormInput.title,
    )
    await expect(page.getByTestId('campaign-audience-builder')).toBeVisible()
    await expect(page.getByTestId('campaign-detail-activate')).toBeVisible()

    await page.getByTestId('campaign-detail-activate').click()
    await expect(page.getByText('Activate this campaign?')).toBeVisible()

    await page.getByRole('button', { name: 'Activate campaign' }).click()

    await expect(page.getByText('Campaign activated.')).toBeVisible()
    await expect(page.getByText('Active')).toBeVisible()
    await expect(page.getByTestId('campaign-detail-activate')).toHaveCount(0)
    await expect(page.getByTestId('campaign-detail-edit')).toHaveCount(0)
    await expect(page.getByTestId('campaign-audience-builder')).toHaveCount(0)
  })

  test('shows the completion table for an active campaign', async ({ page }) => {
    const { campaigns, completionByCampaignId } = await setupCampaignsFlow(page)
    await page.goto('/campaigns')

    await page.getByTestId('campaigns-create').click()
    await page.getByTestId('campaign-form-title').fill(validCampaignFormInput.title)
    await page.getByTestId('campaign-form-description').fill(
      validCampaignFormInput.description,
    )
    await page.getByTestId('campaign-form-purpose').fill(validCampaignFormInput.purpose)
    await page.getByTestId('campaign-form-link').fill(validCampaignFormInput.link)
    await page.getByTestId('campaign-form-due-date').fill(validCampaignFormInput.dueDate)
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByTestId('campaigns-list').locator('button').first().click()

    const campaign = campaigns[0]
    if (campaign) {
      completionByCampaignId.set(campaign.id, {
        recipients: [
          {
            actionItemId: 'action-item-1',
            assignee: { id: 'emp-alice', displayName: 'Alice' },
            status: 'completed',
            dueDate: '2026-12-31',
            isOverdue: false,
            completedAt: '2026-09-07T10:00:00.000Z',
          },
          {
            actionItemId: 'action-item-2',
            assignee: { id: 'emp-bob', displayName: 'Bob' },
            status: 'open',
            dueDate: '2025-12-31',
            isOverdue: true,
          },
          {
            actionItemId: 'action-item-3',
            assignee: { id: 'emp-carol', displayName: 'Carol' },
            status: 'open',
            dueDate: '2026-12-31',
            isOverdue: false,
          },
          {
            actionItemId: 'action-item-4',
            assignee: { id: 'emp-dan', displayName: 'Dan' },
            status: 'cancelled',
            dueDate: '2025-11-01',
            isOverdue: false,
          },
        ],
      })
    }

    await page.getByTestId('campaign-detail-activate').click()
    await page.getByRole('button', { name: 'Activate campaign' }).click()

    await expect(page.getByTestId('campaign-completion-table')).toBeVisible()
    await expect(page.getByTestId('campaign-completion-row-emp-alice')).toContainText(
      'Completed',
    )
    await expect(page.getByTestId('campaign-completion-row-emp-bob')).toContainText(
      'Overdue — was due',
    )
    await expect(page.getByTestId('campaign-completion-row-emp-carol')).toContainText(
      'Not completed',
    )
    await expect(page.getByTestId('campaign-completion-row-emp-dan')).toContainText(
      'Cancelled',
    )
  })

  test('opens an active campaign from the list and shows completion', async ({ page }) => {
    const { campaigns, completionByCampaignId } = await setupCampaignsFlow(page)
    const activeCampaign = createCampaignFixture({
      id: 'campaign-active-list',
      title: 'Active List Survey',
      status: 'active',
    })
    campaigns.push(activeCampaign)
    completionByCampaignId.set(activeCampaign.id, {
      recipients: [
        {
          actionItemId: 'action-item-active',
          assignee: { id: 'emp-alice', displayName: 'Alice' },
          status: 'completed',
          dueDate: '2026-12-31',
          isOverdue: false,
          completedAt: '2026-09-07T10:00:00.000Z',
        },
      ],
    })

    await page.goto('/campaigns')
    await page.getByTestId(`campaign-row-${activeCampaign.id}`).click()

    await expect(page.getByTestId('campaign-detail-title')).toHaveText('Active List Survey')
    await expect(page.getByTestId('campaign-detail-activate')).toHaveCount(0)
    await expect(page.getByTestId('campaign-completion-table')).toBeVisible()
    await expect(page.getByTestId('campaign-completion-row-emp-alice')).toContainText(
      'Completed',
    )
  })

  test('shows an empty completion state for an active campaign with no recipients', async ({
    page,
  }) => {
    await setupCampaignsFlow(page)
    await page.goto('/campaigns')

    await page.getByTestId('campaigns-create').click()
    await page.getByTestId('campaign-form-title').fill(validCampaignFormInput.title)
    await page.getByTestId('campaign-form-description').fill(
      validCampaignFormInput.description,
    )
    await page.getByTestId('campaign-form-purpose').fill(validCampaignFormInput.purpose)
    await page.getByTestId('campaign-form-link').fill(validCampaignFormInput.link)
    await page.getByTestId('campaign-form-due-date').fill(validCampaignFormInput.dueDate)
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByTestId('campaigns-list').locator('button').first().click()
    await page.getByTestId('campaign-detail-activate').click()
    await page.getByRole('button', { name: 'Activate campaign' }).click()

    await expect(page.getByTestId('campaign-completion-empty')).toHaveText(
      'No recipients were included when this campaign was activated.',
    )
  })

  test('disables the activate confirm button while activation is pending', async ({ page }) => {
    await setupCampaignsFlow(page, { activateDelayMs: 2000 })
    await page.goto('/campaigns')

    await page.getByTestId('campaigns-create').click()
    await page.getByTestId('campaign-form-title').fill(validCampaignFormInput.title)
    await page.getByTestId('campaign-form-description').fill(
      validCampaignFormInput.description,
    )
    await page.getByTestId('campaign-form-purpose').fill(validCampaignFormInput.purpose)
    await page.getByTestId('campaign-form-link').fill(validCampaignFormInput.link)
    await page.getByTestId('campaign-form-due-date').fill(validCampaignFormInput.dueDate)
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByTestId('campaigns-list').locator('button').first().click()
    await page.getByTestId('campaign-detail-activate').click()
    await page.getByRole('button', { name: 'Activate campaign' }).click()

    await expect(page.getByRole('button', { name: 'Activating…' })).toBeDisabled()
  })

  test('shows an error and recovers to the locked view when activation 409s', async ({ page }) => {
    const { campaigns } = await setupCampaignsFlow(page)
    await page.goto('/campaigns')

    await page.getByTestId('campaigns-create').click()
    await page.getByTestId('campaign-form-title').fill(validCampaignFormInput.title)
    await page.getByTestId('campaign-form-description').fill(
      validCampaignFormInput.description,
    )
    await page.getByTestId('campaign-form-purpose').fill(validCampaignFormInput.purpose)
    await page.getByTestId('campaign-form-link').fill(validCampaignFormInput.link)
    await page.getByTestId('campaign-form-due-date').fill(validCampaignFormInput.dueDate)
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByTestId('campaigns-list').locator('button').first().click()
    await expect(page.getByTestId('campaign-detail-activate')).toBeVisible()

    // Simulate a concurrent activation from another tab/window that already
    // flipped this campaign to active server-side, before this page sends
    // its own activate request.
    const campaign = campaigns[0]
    if (campaign) {
      campaign.status = 'active'
    }

    await page.getByTestId('campaign-detail-activate').click()
    await expect(page.getByText('Activate this campaign?')).toBeVisible()
    await page.getByRole('button', { name: 'Activate campaign' }).click()

    await expect(page.getByText("Couldn't save. Try again.")).toBeVisible()
    await expect(page.getByText('Activate this campaign?')).toHaveCount(0)

    // The mutation's onError refetches the campaign on 409, so the page
    // recovers to the locked/active view instead of a stale draft view.
    await expect(page.getByText('Active')).toBeVisible()
    await expect(page.getByTestId('campaign-detail-activate')).toHaveCount(0)
    await expect(page.getByTestId('campaign-detail-edit')).toHaveCount(0)
    await expect(page.getByTestId('campaign-audience-builder')).toHaveCount(0)
  })
})
