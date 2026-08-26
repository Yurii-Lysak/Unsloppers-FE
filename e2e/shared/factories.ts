/**
 * Factory primitives for test data.
 *
 * Two properties matter and pull against each other: a test needs values that do
 * not collide with another test's, and it needs the same values on every run. A
 * random generator gives the first and loses the second. These helpers give both
 * by counting deterministically from a reset point.
 *
 * Domain factories are not here on purpose. The API types this app will consume
 * do not exist yet (`src/types/api.ts` holds only `ApiError`), and a factory
 * built on a guessed shape is a fixture that has to be rewritten the day the
 * real shape lands. Build domain data in each flow's own `fixtures.ts` on top of
 * `defineFactory`, and move it here once more than one flow needs it.
 */

let sequence = 0

/** Resets the counter, so a spec can assert on exact generated values. */
export const resetFactoryState = (): void => {
  sequence = 0
}

/** Monotonic counter, unique within a run and identical across runs. */
export const nextSequence = (): number => {
  sequence += 1
  return sequence
}

/** Stable pseudo-identifier, e.g. `employee-1`. */
export const nextId = (prefix: string): string => `${prefix}-${nextSequence()}`

/** Stable unique address in the reserved example.com domain. */
export const nextEmail = (local = 'user'): string => `${local}-${nextSequence()}@example.com`

/**
 * Turns a set of defaults into an override-taking factory.
 *
 * Defaults are produced per call rather than shared, so a factory can hand out
 * fresh identifiers and no two objects accidentally alias the same nested value.
 */
export const defineFactory =
  <T extends object>(defaults: () => T) =>
  (overrides: Partial<T> = {}): T => ({ ...defaults(), ...overrides })
