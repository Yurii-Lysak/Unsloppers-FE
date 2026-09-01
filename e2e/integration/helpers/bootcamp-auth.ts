import { expect, type Page } from '@playwright/test'
import { testEnv } from '../../shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl

export const waitForBackendReady = async () => {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/health`)
      if (response.ok) {
        return
      }
    } catch {
      // Backend still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  throw new Error(`Backend did not become ready at ${apiBaseUrl}/api/v1/health`)
}

export const loginBootcampUser = async (
  page: Page,
  email: string,
  password: string,
) => {
  await page.goto('/')
  await expect(page).toHaveURL('/login')

  await page
    .waitForResponse(response => response.url().includes('/auth/session'), {
      timeout: 15_000,
    })
    .catch(() => undefined)

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)

  const loginResponse = page.waitForResponse(
    response =>
      response.url().includes('/auth/login') && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: 'Sign in' }).click()

  const response = await loginResponse
  expect(
    response.ok(),
    `Login failed for ${email}: ${response.status()} ${await response.text()}`,
  ).toBeTruthy()

  await expect(page).toHaveURL('/')
  await expect(page.getByTestId('home-title')).toBeVisible()
}
