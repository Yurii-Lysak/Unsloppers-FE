import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4200'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  // Retries absorb genuinely environmental failures, but a test that only
  // passes on the third attempt must not report the suite as green — most of
  // this suite exists to prove negative access cases, where a retry-masked
  // intermittent pass is indistinguishable from a leak.
  retries: process.env.CI ? 2 : 0,
  failOnFlakyTests: !!process.env.CI,

  // `fullyParallel` with a single worker cancels itself out. Half the runner's
  // cores keeps the matrix suite parallel without oversubscribing CI.
  workers: process.env.CI ? '50%' : undefined,

  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx vite',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
