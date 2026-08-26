# Shared E2E Test Utilities

Cross-flow utilities. Anything used by more than one flow belongs here; anything
specific to a single flow stays in that flow's folder. See `../README.md` for how
the suite fits together and for usage examples.

## Structure

- `merged-fixtures.ts` — the single entry point for `test` and `expect`. Specs
  import from here, never from `@playwright/test`.
- `api-fixture.ts` — `api`, an `APIRequestContext` pointed at the backend, for
  arranging and tearing down state.
- `network-fixture.ts` — `interceptNetworkCall` (observe) and `stubNetworkCall`
  (replace). Both are declared before the triggering action.
- `clock-fixture.ts` — `fixedClock` with `freezeAt`, `advance`, `jumpTo`.
- `selectors.ts` — test id catalogue plus the rendered / absent / unavailable
  section assertions.
- `factories.ts` — deterministic factory primitives. Domain factories live in
  each flow's `fixtures.ts` until the API types exist.
- `test-env.ts` — test environment configuration, mirroring `src/config/env.ts`
  for Node.

## Adding a fixture

Write a small `<name>-fixture.ts` exporting `test` from `base.extend`, then merge
it into `merged-fixtures.ts`. Keeping each fixture in its own file is what makes
the merge readable as a list of capabilities.
