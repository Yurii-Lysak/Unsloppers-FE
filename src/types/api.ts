export interface Session {
  userId: string
}

export interface LoginCredentials {
  email: string
  password: string
}
/**
 * API response TypeScript interfaces
 */

// Common API error response structure
export interface ApiError {
  message: string
  status: number
  error?: unknown
}
