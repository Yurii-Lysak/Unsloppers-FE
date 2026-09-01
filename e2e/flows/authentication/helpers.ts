import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { testEnv } from '../../shared/test-env'

const apiBaseUrl = testEnv.api.baseUrl

interface SetupAuthApiOptions {
  authenticated: boolean
  userId?: string
}

export const setupAuthApi = async (
  page: Page,
  options: SetupAuthApiOptions,
) => {
  await page.route(`${apiBaseUrl}/api/v1/auth/session**`, async route => {
    if (options.authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ userId: options.userId ?? 'e2e-user-id' }),
      })
      return
    }

    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized', statusCode: 401 }),
    })
  })
}

export const loginViaUi = async (
  page: Page,
  credentials: { email: string; password: string },
) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login$/)

  await page
    .waitForResponse(response => response.url().includes('/auth/session'), {
      timeout: 15_000,
    })
    .catch(() => undefined)

  await page.getByLabel('Email').fill(credentials.email)
  await page.getByLabel('Password').fill(credentials.password)

  const loginResponse = page.waitForResponse(
    response =>
      response.url().includes('/auth/login') && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: /sign in/i }).click()

  const response = await loginResponse
  expect(response.ok(), `Login failed: ${response.status()} ${await response.text()}`).toBeTruthy()
  await expect(page).toHaveURL('/')
}
