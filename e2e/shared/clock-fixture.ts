import { test as base } from '@playwright/test'

/**
 * Browser-side half of the injectable clock.
 *
 * The backend takes time from its own `Clock`, and the rendered surface takes it
 * from the browser. A test about an expiry, an overdue badge, or a freshness
 * window has to move both, and neither should be moved by sleeping.
 *
 * Note that `page.clock.install()` alone is not enough: it sets the starting
 * instant and then lets time run at real speed, which drifts by however long the
 * test takes. Freezing needs the `pauseAt` that `freezeAt` pairs with it.
 */
export interface ClockFixtures {
  fixedClock: {
    /** Installs and pauses browser time at the given instant. Call before `page.goto`. */
    freezeAt: (instant: string | number | Date) => Promise<void>
    /** Moves time forward by a duration, firing timers scheduled in between. */
    advance: (ms: number) => Promise<void>
    /** Jumps to an absolute instant and stays paused there. */
    jumpTo: (instant: string | number | Date) => Promise<void>
  }
}

export const test = base.extend<ClockFixtures>({
  fixedClock: async ({ page }, use) => {
    await use({
      freezeAt: async instant => {
        await page.clock.install({ time: instant })
        await page.clock.pauseAt(instant)
      },
      advance: ms => page.clock.runFor(ms),
      jumpTo: instant => page.clock.pauseAt(instant),
    })
  },
})
