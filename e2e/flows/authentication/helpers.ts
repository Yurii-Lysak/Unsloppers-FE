import type { Page } from '@playwright/test'
import { authenticatedUser, validCredentials } from './fixtures'

interface AuthApiOptions {
  authenticated?: boolean
  sessionFailureStatus?: number
  loginFailureStatus?: number
  logoutFailureStatus?: number
  sessionNetworkFailure?: boolean
  loginNetworkFailure?: boolean
}

export const setupAuthApi = async (
  page: Page,
  options: AuthApiOptions = {}
) => {
  let authenticated = options.authenticated ?? false
  let sessionFailureStatus = options.sessionFailureStatus
  let sessionRequests = 0

  await page.route('http://localhost:3001/api/v1/auth/**', async route => {
    const request = route.request()
    const pathname = new URL(request.url()).pathname

    if (pathname.endsWith('/session')) {
      sessionRequests += 1
      if (options.sessionNetworkFailure) {
        await route.abort('failed')
        return
      }
      if (sessionFailureStatus) {
        await route.fulfill({
          status: sessionFailureStatus,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Service unavailable' }),
        })
        return
      }
      await route.fulfill({
        status: authenticated ? 200 : 401,
        contentType: 'application/json',
        body: JSON.stringify(
          authenticated ? authenticatedUser : { message: 'Unauthorized', statusCode: 401 }
        ),
      })
      return
    }

    if (pathname.endsWith('/login')) {
      if (options.loginNetworkFailure) {
        await route.abort('failed')
        return
      }
      if (options.loginFailureStatus) {
        await route.fulfill({
          status: options.loginFailureStatus,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Service unavailable' }),
        })
        return
      }
      const credentials = request.postDataJSON()
      const valid =
        credentials.email === validCredentials.email &&
        credentials.password === validCredentials.password
      authenticated = valid
      await route.fulfill({
        status: valid ? 200 : 401,
        contentType: 'application/json',
        body: JSON.stringify(
          valid ? authenticatedUser : { message: 'Invalid email or password', statusCode: 401 }
        ),
      })
      return
    }

    if (pathname.endsWith('/logout')) {
      if (options.logoutFailureStatus) {
        await route.fulfill({
          status: options.logoutFailureStatus,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Service unavailable' }),
        })
        return
      }
      authenticated = false
      await route.fulfill({ status: 204, body: '' })
      return
    }

    await route.fulfill({ status: 404, body: '' })
  })

  return {
    expireSession: () => {
      authenticated = false
    },
    failSession: (status = 503) => {
      sessionFailureStatus = status
    },
    restoreSession: () => {
      sessionFailureStatus = undefined
    },
    getSessionRequestCount: () => sessionRequests,
  }
}
