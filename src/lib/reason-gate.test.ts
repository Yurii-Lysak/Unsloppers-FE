import { describe, expect, it } from 'vitest'
import { isReasonConfirmable } from './reason-gate'

const MAX_LENGTH = 2000

describe('isReasonConfirmable', () => {
  it('rejects an empty reason so the confirm stays inoperable', () => {
    expect(isReasonConfirmable('', MAX_LENGTH)).toBe(false)
  })

  it('rejects a whitespace-only reason', () => {
    expect(isReasonConfirmable('   ', MAX_LENGTH)).toBe(false)
  })

  it('accepts a written reason', () => {
    expect(isReasonConfirmable('Candidate lacks on-call experience.', MAX_LENGTH)).toBe(true)
  })

  it('rejects a reason longer than the limit', () => {
    expect(isReasonConfirmable('x'.repeat(MAX_LENGTH + 1), MAX_LENGTH)).toBe(false)
  })

  it('accepts a reason exactly at the limit', () => {
    expect(isReasonConfirmable('x'.repeat(MAX_LENGTH), MAX_LENGTH)).toBe(true)
  })
})
