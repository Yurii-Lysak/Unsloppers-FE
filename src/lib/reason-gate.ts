/**
 * Shared predicate for reason-gated confirms (EXPERIENCE.md Dialog confirms):
 * a destructive confirm stays inoperable-but-focusable until a non-blank
 * reason within the length limit is present. Activating while gated must
 * announce why instead of acting.
 */
export const isReasonConfirmable = (reason: string, maxLength: number): boolean => {
  const trimmedLength = reason.trim().length
  return trimmedLength > 0 && trimmedLength <= maxLength
}
