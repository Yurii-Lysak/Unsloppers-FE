import { expect, test } from '@playwright/test'
import { validCredentials } from './fixtures'
import { setupAuthApi } from './helpers'

test.describe('Authentication', () => {
  test('redirects protected routes to login', async ({ page }) => {
    await setupAuthApi(page)

    await page.goto('/')

    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })

  test('validates the form and shows only a generic credential error', async ({ page }) => {
    await setupAuthApi(page)
    await page.goto('/login')

    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Enter a valid email address.')).toBeVisible()
    await expect(page.getByText('Enter your password.')).toBeVisible()

    await page.getByLabel('Email').fill('unknown@example.com')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByRole('alert')).toHaveText(
      'The email or password is incorrect.'
    )
  })

  test('distinguishes login service failures from invalid credentials', async ({ page }) => {
    await setupAuthApi(page, { loginFailureStatus: 503 })
    await page.goto('/login')

    await page.getByLabel('Email').fill(validCredentials.email)
    await page.getByLabel('Password').fill(validCredentials.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByRole('alert')).toHaveText(
      'Sign-in is temporarily unavailable. Check your connection and try again.'
    )
  })

  test('distinguishes login network failures from invalid credentials', async ({ page }) => {
    await setupAuthApi(page, { loginNetworkFailure: true })
    await page.goto('/login')

    await page.getByLabel('Email').fill(validCredentials.email)
    await page.getByLabel('Password').fill(validCredentials.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByRole('alert')).toHaveText(
      'Sign-in is temporarily unavailable. Check your connection and try again.'
    )
  })

  test('renders a retryable error instead of redirecting on session bootstrap failure', async ({
    page,
  }) => {
    const authApi = await setupAuthApi(page, {
      authenticated: true,
      sessionFailureStatus: 503,
    })

    await page.goto('/')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'We couldn’t verify your session' })).toBeVisible()
    authApi.restoreSession()
    await page.getByRole('button', { name: 'Try again' }).click()
    await expect(page.getByTestId('home-title')).toBeVisible()
  })

  test('renders the unavailable state on a session network failure', async ({ page }) => {
    await setupAuthApi(page, { sessionNetworkFailure: true })

    await page.goto('/')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'We couldn’t verify your session' })).toBeVisible()
  })

  test('logs in, restores the session after reload, and stores no token', async ({ page }) => {
    await setupAuthApi(page)
    await page.goto('/login')

    await page.getByLabel('Email').fill(validCredentials.email)
    await page.getByLabel('Password').fill(validCredentials.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('home-title')).toBeVisible()
    await page.reload()
    await expect(page.getByTestId('home-title')).toBeVisible()
    expect(
      await page.evaluate(() => ({
        local: { ...localStorage },
        session: { ...sessionStorage },
      }))
    ).not.toMatchObject({
      local: expect.objectContaining({ token: expect.anything() }),
      session: expect.objectContaining({ token: expect.anything() }),
    })
  })

  test('redirects to login when a restored session expires', async ({ page }) => {
    const authApi = await setupAuthApi(page, { authenticated: true })
    await page.goto('/')
    await expect(page.getByTestId('home-title')).toBeVisible()

    authApi.expireSession()
    await page.reload()

    await expect(page).toHaveURL('/login')
  })

  test('periodically revalidates and expires an idle protected session', async ({ page }) => {
    await page.clock.install()
    const authApi = await setupAuthApi(page, { authenticated: true })
    await page.goto('/')
    await expect(page.getByTestId('home-title')).toBeVisible()
    const initialRequests = authApi.getSessionRequestCount()

    authApi.expireSession()
    await page.clock.fastForward(60_000)

    await expect.poll(authApi.getSessionRequestCount).toBeGreaterThan(initialRequests)
    await expect(page).toHaveURL('/login')
  })

  test('preserves path, search, and hash through login', async ({ page }) => {
    await setupAuthApi(page)
    await page.goto('/app-error?source=session#details')
    await expect(page).toHaveURL('/login')

    await page.getByLabel('Email').fill(validCredentials.email)
    await page.getByLabel('Password').fill(validCredentials.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/app-error?source=session#details')
    await expect(page.getByRole('heading', { name: 'Application Error' })).toBeVisible()
  })

  test('rejects login itself as a post-login destination', async ({ page }) => {
    await setupAuthApi(page)
    await page.goto('/login')
    await page.evaluate(() => {
      history.replaceState(
        { ...history.state, usr: { from: '/login?loop=true#again' } },
        '',
        '/login'
      )
    })
    await page.reload()

    await page.getByLabel('Email').fill(validCredentials.email)
    await page.getByLabel('Password').fill(validCredentials.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/')
  })

  test('logs out and returns to login', async ({ page }) => {
    await setupAuthApi(page, { authenticated: true })
    await page.goto('/')

    await page.getByRole('button', { name: 'Sign out' }).click()

    await expect(page).toHaveURL('/login')
  })

  test('keeps the session and exposes an error when logout fails', async ({ page }) => {
    await setupAuthApi(page, {
      authenticated: true,
      logoutFailureStatus: 503,
    })
    await page.goto('/')

    await page.getByRole('button', { name: 'Sign out' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('alert')).toHaveText('Sign-out failed. Try again.')
    await expect(page.getByTestId('home-title')).toBeVisible()
  })
})
