import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

interface SeedManifest {
  identities: Array<{ email: string }>
}

const manifest = JSON.parse(
  readFileSync('../backend/src/prisma/seed/data/bootcamp-identities.json', 'utf8')
) as SeedManifest

test('uses real backend bootstrap and browser cookies for the core auth flow', async ({
  page,
  request,
  context,
}) => {
  const password = process.env.BOOTCAMP_INITIAL_PASSWORD
  if (!password) {
    throw new Error('Integration seed password was not configured')
  }

  await request.get('http://localhost:3001/auth/session').then(response => {
    expect(response.status()).toBe(404)
  })
  await request.get('http://localhost:3001/api/v1/health').then(response => {
    expect(response.ok()).toBe(true)
  })
  const preflight = await request.fetch('http://localhost:3001/api/v1/auth/login', {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:4200',
      'Access-Control-Request-Method': 'POST',
    },
  })
  expect(preflight.headers()['access-control-allow-origin']).toBe('http://localhost:4200')
  expect(preflight.headers()['access-control-allow-credentials']).toBe('true')

  await page.goto('/')
  await expect(page).toHaveURL('/login')
  await page.getByLabel('Email').fill(manifest.identities[0].email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByTestId('home-title')).toBeVisible()
  const sessionCookie = (await context.cookies()).find(cookie => cookie.name === 'session')
  expect(sessionCookie).toMatchObject({
    httpOnly: true,
    sameSite: 'Strict',
    secure: false,
  })
  expect(await page.evaluate(() => document.cookie)).not.toContain('session=')

  await page.reload()
  await expect(page.getByTestId('home-title')).toBeVisible()
  await page.getByRole('button', { name: 'Sign out' }).click()

  await expect(page).toHaveURL('/login')
  expect((await context.cookies()).some(cookie => cookie.name === 'session')).toBe(false)
})
