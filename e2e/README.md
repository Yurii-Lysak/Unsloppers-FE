# E2E Test Suite

Playwright suite for the rendered surface of the people management SPA.

## Running

```bash
npm run test              # headless, starts Vite itself
npm run test -- harness   # one file or flow
npm run test:headed       # watch it run
npm run test:ui           # pick and debug interactively
```

Node 22 is required (`../backend/.nvmrc` pins the same version): Vite 8 declares
`^20.19.0 || >=22.12.0`, and on an older Node the native rolldown binding is
skipped at install time and the dev server refuses to boot.

`BASE_URL` overrides where the suite points, defaulting to
`http://127.0.0.1:4200`. `VITE_API_BASE_URL` points the `api` fixture at the
backend, defaulting to `http://localhost:3001`.

## What lives where

```
e2e/
  app.spec.ts             # app-level smoke
  harness.spec.ts         # self-test for the shared fixtures below
  flows/                  # one folder per user flow
    some-feature/
      some-feature.spec.ts
      fixtures.ts         # test DATA for this flow
      helpers.ts          # mock setup FUNCTIONS for this flow
  shared/                 # cross-flow utilities
    merged-fixtures.ts    # the only place specs import `test` from
    api-fixture.ts        # direct APIRequestContext for arranging state
    network-fixture.ts    # interceptNetworkCall / stubNetworkCall
    clock-fixture.ts      # freezeAt / advance / jumpTo
    selectors.ts          # test id catalogue + section assertions
    factories.ts          # deterministic data factory primitives
    test-env.ts           # mirrors src/config/env.ts for Node
```

Inside a flow folder the existing split still holds: `fixtures.ts` is data,
`helpers.ts` is functions, and nothing calls `page.route()` inline in a spec.

## Importing test

Always from the merged entry point, never from `@playwright/test`:

```ts
import { expect, test } from './shared/merged-fixtures'
```

That is what makes every fixture below available in every spec. A new capability
becomes a small `*-fixture.ts` in `shared/`, merged into `merged-fixtures.ts`.

## Network first

Declare the call before the action that triggers it, then await it after. A test
that navigates and only then starts waiting has already lost the race.

```ts
test('loads the directory', async ({ page, interceptNetworkCall }) => {
  const employees = interceptNetworkCall({ url: '/api/v1/employees', method: 'GET' })

  await page.goto('/employees')

  const { status } = await employees.settled
  expect(status).toBe(200)
})
```

To replace a response rather than observe it, stub before navigating:

```ts
await stubNetworkCall({ url: '/api/v1/employees', body: { items: [] }, status: 200 })
```

`stubNetworkCall` takes an optional `delayMs`, which is how a loading state gets
asserted without a `waitForTimeout`.

## Time

Never sleep to cross a deadline. `freezeAt` installs and pauses browser time,
`advance` moves it by a duration, `jumpTo` jumps to an instant.

```ts
await fixedClock.freezeAt('2026-01-05T09:00:00.000Z')
await page.goto('/action-items')
await fixedClock.advance(8 * 24 * 60 * 60 * 1000)
```

`page.clock.install()` on its own only sets the starting instant and then lets
time run at real speed — that is why `freezeAt` pairs it with `pauseAt`.

## Selectors

Locator priority is unchanged: `getByRole` > `getByLabel` > `getByTestId` > CSS.
Reach for a test id where identity matters more than presentation, which is
exactly the case for the access-sensitive surfaces. Those ids are catalogued in
`shared/selectors.ts` so no spec hardcodes the string.

Three helpers encode a distinction the suite cannot afford to blur:

| Helper                      | Means                                                     |
| --------------------------- | --------------------------------------------------------- |
| `expectSectionRendered`     | granted, and rendered with content                        |
| `expectSectionAbsent`       | not granted — nothing about the section reaches the page   |
| `expectSectionUnavailable`  | granted, but the provider could not answer                 |

Absent and unavailable look the same to a human reading the page, and they mean
opposite things. Asserting them by section key rather than by rendered copy is
what keeps them apart.

## What this suite does not assert

API response shapes. Playwright starts only Vite, so the backend it can reach is
whatever the developer happens to have running. Every assertion of the form
"this field is absent from the response for this audience" belongs to the backend
Supertest tier, which owns a real database and a real application instance. This
suite owns what the browser renders.

The `api` fixture exists to arrange and tear down state, not to assert on it.

## Not yet here

- **Accessibility scans.** WCAG 2.1 AA on List, Profile, and Dashboards is a
  stated requirement, and the automated half needs an axe integration that is not
  installed. Adding it is a dependency decision, so it is a deliberate follow-up
  rather than a silent install.
- **Full-stack runs.** Starting the backend and Postgres from `webServer` would
  let this suite cover flows end to end. Until then, run the backend yourself and
  point `VITE_API_BASE_URL` at it.
