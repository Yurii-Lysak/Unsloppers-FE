/**
 * Inline revoke-confirm state machine (EXPERIENCE.md Dialog discipline):
 * revoking a shared link requires an explicit confirm, rendered inline in
 * the manage list so dialogs never stack. The link itself is retained until
 * the revoke succeeds, so a failed revoke keeps the row plus a retry path.
 */
export type RevokeConfirmState = string | null

export const armRevokeConfirm = (linkId: string): RevokeConfirmState => linkId

export const cancelRevokeConfirm = (): RevokeConfirmState => null
