import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const backendEnvPath = '../backend/.env'
const backendEnv = existsSync(backendEnvPath)
  ? readFileSync(backendEnvPath, 'utf8')
  : ''
const readBackendEnv = (key: string) => {
  const raw = backendEnv.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim()
  if (!raw) {
    return undefined
  }
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1)
  }
  return raw
}

const backendEnvironment = {
  NODE_ENV: 'test',
  CORS_ORIGIN: 'http://localhost:4200',
  DATABASE_URL:
    process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/app',
  JWT_SECRET:
    process.env.JWT_SECRET ??
    readBackendEnv('JWT_SECRET') ??
    randomBytes(48).toString('base64url'),
  JWT_TTL_SECONDS: '3600',
  BOOTCAMP_INITIAL_PASSWORD:
    process.env.BOOTCAMP_INITIAL_PASSWORD ??
    readBackendEnv('BOOTCAMP_INITIAL_PASSWORD') ??
    randomBytes(32).toString('base64url'),
}

Object.assign(process.env, backendEnvironment)

export default defineConfig({
  testDir: './e2e/integration',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command:
        'npm --prefix ../backend run db:up && npm --prefix ../backend run db:generate && npm --prefix ../backend run build && npm --prefix ../backend run start:prod',
      url: 'http://localhost:3001/api/v1/health',
      env: backendEnvironment,
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: 'npx vite --host localhost',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
