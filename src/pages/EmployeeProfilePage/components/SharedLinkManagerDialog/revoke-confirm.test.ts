import { describe, expect, it } from 'vitest'
import { armRevokeConfirm, cancelRevokeConfirm } from './revoke-confirm'

describe('revoke confirm state', () => {
  it('arms the confirm for the chosen link before any revoke happens', () => {
    expect(armRevokeConfirm('link-1')).toBe('link-1')
  })

  it('cancelling clears the armed confirm without revoking', () => {
    expect(cancelRevokeConfirm()).toBeNull()
  })
})
