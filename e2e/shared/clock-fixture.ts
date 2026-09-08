import { test as base } from '@playwright/test'

/** Install this far before the target so pauseAt never lands in the past. */
const CLOCK_LEAD_MS = 3_600_000

const toEpochMs = (instant: string | number | Date): number => new Date(instant).getTime()

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
 *
 * Playwright also rejects `pauseAt` when the target is not strictly after the
 * current fake clock — install must start earlier than the instant you pause at.
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
    const pauseAtInstant = async (instant: string | number | Date) => {
      const targetMs = toEpochMs(instant)
      await page.clock.install({ time: targetMs - CLOCK_LEAD_MS })
      await page.clock.pauseAt(instant)
    }

    await use({
      freezeAt: pauseAtInstant,
      advance: ms => page.clock.runFor(ms),
      jumpTo: async instant => {
        const targetMs = toEpochMs(instant)
        const currentMs = await page.evaluate(() => Date.now())
        const delta = targetMs - currentMs

        if (delta < 0) {
          await pauseAtInstant(instant)
          return
        }

        await page.clock.pauseAt(instant)
      },
    })
  },
})
