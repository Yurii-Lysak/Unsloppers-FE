// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScopedPeopleTable } from '@/components/DashboardEngine/ScopedPeopleTable/ScopedPeopleTable'
import { renderWithProviders } from '@/test-utils/test-render'

describe('ScopedPeopleTable spine contract', () => {
  it('drills via a name-cell link with an accessible label', () => {
    renderWithProviders(
      <ScopedPeopleTable
        variant="um"
        rows={[
          {
            employeeId: 'emp-1',
            displayName: 'Ada Lovelace',
            leaveStatus: 'available',
            leaveLabel: 'On leave',
            projectStatus: 'available',
            projectLabel: 'Atlas',
          },
        ]}
      />,
    )

    const link = screen.getByTestId('dashboard-link-emp-1')
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/employees/emp-1')
    expect(link.getAttribute('aria-label')).toBe('Open profile for Ada Lovelace')
  })

  it('renders denied cells as absent and surfaces staleness via the banner only', () => {
    renderWithProviders(
      <ScopedPeopleTable
        variant="pp"
        rows={[
          {
            employeeId: 'emp-1',
            displayName: 'Ada Lovelace',
            leaveStatus: 'unavailable',
            projectStatus: 'available',
            projectLabel: 'Atlas',
            departmentStatus: 'unavailable',
            departmentStale: true,
          },
        ]}
      />,
    )

    const row = screen.getByTestId('dashboard-row-emp-1')
    expect(row.textContent).not.toContain('—')
    expect(row.textContent).not.toContain('unavailable')
    // Denied/status-less cells render no content at all.
    expect(row.querySelectorAll('td')[2]?.textContent).toBe('')
    expect(screen.getByTestId('dashboard-stale-banner').textContent).toContain(
      'Showing last-known data — sync delayed.',
    )
  })

  it('shows no stale banner when nothing is stale', () => {
    renderWithProviders(
      <ScopedPeopleTable
        variant="um"
        rows={[
          {
            employeeId: 'emp-1',
            displayName: 'Ada Lovelace',
            leaveStatus: 'available',
            leaveLabel: 'Active',
            projectStatus: 'available',
            projectLabel: 'Atlas',
          },
        ]}
      />,
    )

    expect(screen.queryByTestId('dashboard-stale-banner')).toBeNull()
  })
})
