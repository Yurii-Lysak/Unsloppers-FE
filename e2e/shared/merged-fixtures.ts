import { mergeTests } from '@playwright/test'
import { test as apiFixture } from './api-fixture'
import { test as clockFixture } from './clock-fixture'
import { test as networkFixture } from './network-fixture'

/**
 * The single entry point for `test` in this suite.
 *
 * Specs import from here rather than from `@playwright/test`, so a fixture added
 * once becomes available everywhere instead of being wired up per file. Adding a
 * capability means writing a small `*-fixture.ts` next to these and merging it
 * in below.
 */
export const test = mergeTests(apiFixture, networkFixture, clockFixture)

export { expect } from '@playwright/test'
