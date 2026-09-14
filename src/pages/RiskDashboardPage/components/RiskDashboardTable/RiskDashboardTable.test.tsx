// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RiskDashboardTable } from '@/pages/RiskDashboardPage/components/RiskDashboardTable/RiskDashboardTable'
import { renderWithProviders } from '@/test-utils/test-render'

describe('RiskDashboardTable spine contract', () => {
  it('drills via a name-cell link and renders empty cells as absent', () => {
    renderWithProviders(
      <RiskDashboardTable
        rows={[
          {
            employeeId: 'emp-high-1',
            displayName: 'High One',
            currentLevel: 'high',
            trend: 'up',
            recordedAt: '2026-01-04',
            managerName: 'Manager A',
            peoplePartnerName: '',
          },
        ]}
      />,
    )

    const link = screen.getByTestId('risk-dashboard-link-emp-high-1')
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/employees/emp-high-1')
    expect(link.getAttribute('aria-label')).toBe('Open profile for High One')

    const row = screen.getByTestId('risk-dashboard-row-emp-high-1')
    expect(row.textContent).not.toContain('—')
    // Blank people-partner name renders no content.
    expect(row.querySelectorAll('td')[4]?.textContent).toBe('')
  })
})
