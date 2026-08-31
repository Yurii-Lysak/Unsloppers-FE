import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

interface SeedManifest {
  identities: Array<{ id: number; email: string }>
}

const manifest = JSON.parse(
  readFileSync('../backend/src/prisma/seed/data/bootcamp-identities.json', 'utf8'),
) as SeedManifest

const siteAdministrator = manifest.identities.find(identity => identity.id === 1)
if (!siteAdministrator) {
  throw new Error('Bootcamp manifest is missing Site Administrator identity id 1')
}

test('Site Administrator can reach Admin → Roles and create a custom role', async ({
  page,
}) => {
  const password = process.env.BOOTCAMP_INITIAL_PASSWORD
  if (!password) {
    throw new Error('Integration seed password was not configured')
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(siteAdministrator.email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL('/')

  await page.getByTestId('sidebar-admin-roles').click()
  await expect(page).toHaveURL('/admin/roles')
  await expect(page.getByTestId('admin-roles-title')).toBeVisible()

  const roleName = `Security Champion ${Date.now()}`
  await page.getByTestId('admin-roles-create').click()
  await page.getByLabel('Role name').fill(roleName)
  await page.getByLabel('Create form campaigns').check()
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText(roleName)).toBeVisible()

  await page.reload()
  await expect(page.getByText(roleName)).toBeVisible()
})
