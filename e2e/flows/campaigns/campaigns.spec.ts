import { setupCampaignsFlow, validCampaignFormInput } from './helpers'
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
