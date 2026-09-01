import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { testEnv } from '../../shared/test-env'
import { authenticatedUser, validCredentials } from './fixtures'

const apiBaseUrl = testEnv.api.baseUrl

interface SetupAuthApiOptions {
  authenticated?: boolean
  userId?: string
  loginFailureStatus?: number
  loginNetworkFailure?: boolean
  sessionFailureStatus?: number
  sessionNetworkFailure?: boolean
  logoutFailureStatus?: number
}

export interface AuthApiController {
  restoreSession: () => void
  expireSession: () => void
  getSessionRequestCount: () => number
}

export const setupAuthApi = async (
  page: Page,
  options: SetupAuthApiOptions = {},
): Promise<AuthApiController> => {
  let sessionAuthenticated = options.authenticated ?? false
  let sessionFailureStatus = options.sessionFailureStatus
  let sessionNetworkFailure = options.sessionNetworkFailure ?? false
  let sessionRequestCount = 0

  const restoreSession = () => {
    sessionAuthenticated = options.authenticated ?? true
    sessionFailureStatus = undefined
    sessionNetworkFailure = false
  }

  const expireSession = () => {
    sessionAuthenticated = false
    sessionFailureStatus = undefined
    sessionNetworkFailure = false
  }

  await page.route(`${apiBaseUrl}/api/v1/auth/session**`, async route => {
    sessionRequestCount += 1

    if (sessionNetworkFailure) {
      await route.abort('failed')
      return
    }

    if (sessionFailureStatus) {
      await route.fulfill({
        status: sessionFailureStatus,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Service unavailable',
          statusCode: sessionFailureStatus,
        }),
      })
      return
    }

    if (sessionAuthenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: options.userId ?? authenticatedUser.userId,
        }),
      })
      return
    }

    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized', statusCode: 401 }),
    })
  })

  await page.route(`${apiBaseUrl}/api/v1/auth/login**`, async route => {
    if (options.loginNetworkFailure) {
      await route.abort('failed')
      return
    }

    if (options.loginFailureStatus) {
      await route.fulfill({
        status: options.loginFailureStatus,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Service unavailable',
          statusCode: options.loginFailureStatus,
        }),
      })
      return
    }

    const credentials = route.request().postDataJSON() as {
      email?: string
      password?: string
    }

    const isValidLogin =
      credentials.email === validCredentials.email &&
      credentials.password === validCredentials.password

    if (!isValidLogin) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized', statusCode: 401 }),
      })
      return
    }

    sessionAuthenticated = true
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        userId: options.userId ?? authenticatedUser.userId,
      }),
    })
  })

  await page.route(`${apiBaseUrl}/api/v1/auth/logout**`, async route => {
    if (options.logoutFailureStatus) {
      await route.fulfill({
        status: options.logoutFailureStatus,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Service unavailable',
          statusCode: options.logoutFailureStatus,
        }),
      })
      return
    }

    sessionAuthenticated = false
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    })
  })

  return {
    restoreSession,
    expireSession,
    getSessionRequestCount: () => sessionRequestCount,
  }
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
