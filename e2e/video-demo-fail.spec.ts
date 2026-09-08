import { expect, test } from './shared/merged-fixtures'

// Temporary demo spec — delete after verifying video-on-failure locally.
test('video demo — intentional failure', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('This text does not exist — video demo failure')).toBeVisible()
})
