const E164_PHONE_PATTERN = /^\+[1-9]\d{7,14}$/

export const isLikelyPhoneNumber = (value: string): boolean =>
  E164_PHONE_PATTERN.test(value)
