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
})
