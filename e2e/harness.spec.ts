import { expect, test } from './shared/merged-fixtures'
import { expectSectionAbsent } from './shared/selectors'

/**
 * Self-test for the shared harness.
 *
 * Every later spec is built on these fixtures, so a silent breakage here would
 * surface as a confusing failure somewhere else — or worse, as an assertion that
 * passes without asserting anything. These cases also double as the reference
 * for how each fixture is meant to be used.
 */
test.describe('test harness', () => {
  test('interception declared before navigation observes the response', async ({
    page,
    interceptNetworkCall,
  }) => {
    // Given a call is being waited for before anything triggers it
    const documentLoad = interceptNetworkCall({ url: '/', method: 'GET' })

    // When the navigation happens
    await page.goto('/')

    // Then the waiting call resolves, with no polling and no timeout
    const { status } = await documentLoad.settled
    expect(status).toBe(200)
  })

  test('a stubbed call answers instead of the network', async ({ page, stubNetworkCall }) => {
    // Given the endpoint is stubbed before the page can reach it
    await stubNetworkCall({
      url: '/api/v1/probe',
      body: { stubbed: true },
      status: 201,
    })
    await page.goto('/')

    // When the page calls it
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/v1/probe')
      return { status: response.status, body: await response.json() }
    })

    // Then the stub answered
    expect(result).toEqual({ status: 201, body: { stubbed: true } })
  })

  test('a stub scoped to one method leaves the others alone', async ({ page, stubNetworkCall }) => {
    await stubNetworkCall({ url: '/api/v1/probe', method: 'POST', body: { via: 'stub' } })
    await page.goto('/')

    const status = await page.evaluate(async () => {
      const response = await fetch('/api/v1/probe', { method: 'GET' })
      return response.status
    })

    // Vite serves the SPA fallback for an unknown GET path, so the stub did not
    // answer it — which is the point: the POST stub did not widen to every verb.
    expect(status).not.toBe(201)
  })

  test('browser time is frozen where the clock is frozen', async ({ page, fixedClock }) => {
    // Given browser time is pinned before the app boots
    await fixedClock.freezeAt('2026-01-05T09:00:00.000Z')
    await page.goto('/')

    // When the page reads the clock
    const observed = await page.evaluate(() => new Date().toISOString())

    // Then it sees the instant the test chose, however long the test took
    expect(observed).toBe('2026-01-05T09:00:00.000Z')
  })

  test('browser time moves only when the test moves it', async ({ page, fixedClock }) => {
    await fixedClock.freezeAt('2026-01-05T09:00:00.000Z')
    await page.goto('/')

    await fixedClock.advance(90_000)

    const observed = await page.evaluate(() => new Date().toISOString())
    expect(observed).toBe('2026-01-05T09:01:30.000Z')
  })

  test('browser time can jump to an absolute instant', async ({ page, fixedClock }) => {
    await fixedClock.freezeAt('2026-01-05T09:00:00.000Z')
    await page.goto('/')

    await fixedClock.jumpTo('2026-02-01T00:00:00.000Z')

    const observed = await page.evaluate(() => new Date().toISOString())
    expect(observed).toBe('2026-02-01T00:00:00.000Z')
  })

  test('a direct API context is available for arranging state', async ({ api }) => {
    // The context exists and is configured; it is not asserted against here
    // because the backend is not part of this suite's webServer.
    expect(typeof api.get).toBe('function')
  })

  test('section absence is assertable by key', async ({ page }) => {
    await page.goto('/')

    // No profile is rendered here, so every section key is absent. The helper
    // proves it without depending on any rendered copy.
    await expectSectionAbsent(page, 'S7')
  })
})
