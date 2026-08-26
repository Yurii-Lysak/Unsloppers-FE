import { test as base, type APIRequestContext } from '@playwright/test'
import { testEnv } from './test-env'

/**
 * A direct API context for arranging and tearing down state.
 *
 * Driving setup through the UI makes a test fail for reasons unrelated to what
 * it asserts. This context talks to the backend directly for that work.
 *
 * It is deliberately not the place to assert response shapes: Playwright starts
 * only Vite, so the API this suite can reach is whatever the developer happens
 * to have running. Response-body assertions — above all "this field is absent
 * for this audience" — belong to the backend Supertest tier, which owns a real
 * database and a real app instance.
 */
export interface ApiFixtures {
  api: APIRequestContext
}

export const test = base.extend<ApiFixtures>({
  api: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: testEnv.api.baseUrl,
    })

    await use(context)

    await context.dispose()
  },
})
