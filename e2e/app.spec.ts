import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testIds } from './shared/selectors'

test.describe('App', () => {
  test('should load homepage successfully', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await page.goto('/')

    // App container renders without errors
    await expect(page.getByTestId(testIds.app.container)).toBeVisible()

    // Home page renders inside the main layout
    await expect(page.getByTestId(testIds.app.homeTitle)).toBeVisible()
  })

  test('should redirect unknown routes to home', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await page.goto('/some-unknown-route')

    await expect(page).toHaveURL('/')
    await expect(page.getByTestId(testIds.app.homeTitle)).toBeVisible()
  })
})
