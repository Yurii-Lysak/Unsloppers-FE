import { expect, test } from './shared/merged-fixtures'

// Temporary demo spec — used by the e2e-failure-artifacts-smoke CI job.
test('video demo — intentional failure', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('This text does not exist — video demo failure')).toBeVisible()
})
