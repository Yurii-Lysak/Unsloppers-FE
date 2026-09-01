/**
 * Type-safe environment configuration
 */

interface EnvironmentConfig {
  api: {
    baseUrl: string
    timeout: number
  }
}

function getEnvVarWithDefault(name: string, defaultValue: string): string {
  return import.meta.env[name] || defaultValue
}

const parseTimeout = (raw: string): number => {
  const parsed = parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30_000
}

export const env: EnvironmentConfig = {
  api: {
    baseUrl: getEnvVarWithDefault('VITE_API_BASE_URL', 'http://localhost:3001'),
    timeout: parseTimeout(getEnvVarWithDefault('VITE_API_TIMEOUT', '30000')),
  },
}
