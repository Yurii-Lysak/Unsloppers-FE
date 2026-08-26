import { test as base, type Page } from '@playwright/test'

/**
 * Network-first primitives.
 *
 * A test that navigates and then starts waiting has already lost the race for a
 * fast response. Both helpers here are declared before the action that triggers
 * the call, so the waiting is visible in the shape of the test rather than
 * implied by a timeout.
 */

export interface CallSpec {
  /** Substring of the request URL, or a pattern to match it against. */
  url: string | RegExp
  /** Restricts the match to one HTTP method. */
  method?: string
}

export interface StubSpec extends CallSpec {
  status?: number
  body?: unknown
  /** Holds the response back, so a loading state can be asserted. */
  delayMs?: number
}

export interface InterceptedCall {
  status: number
  url: string
  method: string
  /** Parsed JSON body, or the raw text when the body is not JSON. */
  body: unknown
}

export interface Interception {
  /** Resolves once the application has made the call. */
  settled: Promise<InterceptedCall>
}

export interface NetworkFixtures {
  /** Declare before the triggering action, await after it. */
  interceptNetworkCall: (spec: CallSpec) => Interception
  /** Replaces the response for matching requests for the rest of the test. */
  stubNetworkCall: (spec: StubSpec) => Promise<void>
}

const matchesUrl = (actual: string, expected: string | RegExp): boolean =>
  typeof expected === 'string' ? actual.includes(expected) : expected.test(actual)

const matchesMethod = (actual: string, expected?: string): boolean =>
  expected === undefined || actual.toUpperCase() === expected.toUpperCase()

const createInterceptor =
  (page: Page) =>
  (spec: CallSpec): Interception => {
    const settled = page
      .waitForResponse(
        response =>
          matchesUrl(response.url(), spec.url) &&
          matchesMethod(response.request().method(), spec.method)
      )
      .then(async response => {
        const text = await response.text()
        let body: unknown = text
        try {
          body = JSON.parse(text)
        } catch {
          // Not JSON; the raw text is the more useful failure message.
        }

        return {
          status: response.status(),
          url: response.url(),
          method: response.request().method(),
          body,
        }
      })

    // Keeps an unawaited interception from surfacing as an unhandled rejection.
    // The original promise is what the caller gets, so nothing is swallowed.
    void settled.catch(() => undefined)

    return { settled }
  }

const createStubber =
  (page: Page) =>
  async (spec: StubSpec): Promise<void> => {
    await page.route(
      url => matchesUrl(url.toString(), spec.url),
      async route => {
        if (!matchesMethod(route.request().method(), spec.method)) {
          await route.fallback()
          return
        }

        if (spec.delayMs !== undefined && spec.delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, spec.delayMs))
        }

        await route.fulfill({
          status: spec.status ?? 200,
          contentType: 'application/json',
          body: JSON.stringify(spec.body ?? {}),
        })
      }
    )
  }

export const test = base.extend<NetworkFixtures>({
  interceptNetworkCall: async ({ page }, use) => {
    await use(createInterceptor(page))
  },

  stubNetworkCall: async ({ page }, use) => {
    await use(createStubber(page))
  },
})
