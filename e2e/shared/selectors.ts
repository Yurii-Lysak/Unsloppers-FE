import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Test id catalogue.
 *
 * Selectors for the access-sensitive surfaces are keyed rather than derived from
 * copy or layout, because the assertions built on them are about absence. Proving
 * "this section did not render" by searching for text is proving something about
 * the wording; proving it by key is proving something about the section.
 *
 * Locator priority elsewhere is unchanged: prefer `getByRole` and `getByLabel`,
 * and reach for a test id where identity matters more than presentation.
 */
export const testIds = {
  app: {
    container: 'app-container',
    homeTitle: 'home-title',
  },
  employeeList: {
    table: 'employee-list-table',
    row: (employeeId: string) => `employee-list-row-${employeeId}`,
    filter: (field: string) => `employee-list-filter-${field}`,
  },
  profile: {
    /** One per registered section, so a test can assert absence by key. */
    section: (sectionKey: string) => `profile-section-${sectionKey}`,
    /** Distinct from absent: granted, but the provider could not answer. */
    sectionUnavailable: (sectionKey: string) => `profile-section-unavailable-${sectionKey}`,
  },
  dashboard: {
    counter: (metric: string) => `dashboard-counter-${metric}`,
    projectSelector: 'dashboard-project-selector',
  },
  sharedLink: {
    view: 'shared-link-view',
    error: 'shared-link-error',
  },
  actionItem: {
    item: (actionItemId: string) => `action-item-${actionItemId}`,
    complete: 'action-item-complete',
    cancel: 'action-item-cancel',
  },
} as const

export const profileSection = (page: Page, sectionKey: string): Locator =>
  page.getByTestId(testIds.profile.section(sectionKey))

export const profileSectionUnavailable = (page: Page, sectionKey: string): Locator =>
  page.getByTestId(testIds.profile.sectionUnavailable(sectionKey))

/** The section is granted and rendered with content. */
export const expectSectionRendered = async (page: Page, sectionKey: string): Promise<void> => {
  await expect(profileSection(page, sectionKey)).toBeVisible()
  await expect(profileSectionUnavailable(page, sectionKey)).toHaveCount(0)
}

/**
 * The section is not granted to this audience: nothing about it reaches the page.
 * A `—` cell in the access matrix means exactly this, and it is what separates a
 * correct denial from a leak.
 */
export const expectSectionAbsent = async (page: Page, sectionKey: string): Promise<void> => {
  await expect(profileSection(page, sectionKey)).toHaveCount(0)
  await expect(profileSectionUnavailable(page, sectionKey)).toHaveCount(0)
}

/**
 * The section is granted but its provider could not answer. Deliberately
 * distinguishable from absence — conflating the two is how a missing provider
 * registration comes to look like a denial.
 */
export const expectSectionUnavailable = async (page: Page, sectionKey: string): Promise<void> => {
  await expect(profileSectionUnavailable(page, sectionKey)).toBeVisible()
}
