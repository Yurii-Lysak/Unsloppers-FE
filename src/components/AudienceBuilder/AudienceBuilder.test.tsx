// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AudienceBuilder } from '@/components/AudienceBuilder/AudienceBuilder'
import { renderWithProviders } from '@/test-utils/test-render'
import type { CampaignAudienceDefinition } from '@/types/campaigns'
import type { FieldSpec } from '@/types/employees'

const fieldCatalog: FieldSpec[] = [
  {
    id: 'department',
    name: 'Department',
    type: 'select',
    source: 'builtin',
    sortable: true,
    filterable: true,
    options: ['Engineering'],
  },
]

const definition: CampaignAudienceDefinition = {
  filters: [{ fieldId: 'department', operator: 'eq', value: 'Engineering' }],
  addedEmployeeIds: [],
  excludedEmployeeIds: [],
}

describe('AudienceBuilder filter chips', () => {
  it('gives each active filter an accessible remove name and calls back on remove', async () => {
    const user = userEvent.setup()
    const onDefinitionChange = vi.fn()
    renderWithProviders(
      <AudienceBuilder
        definition={definition}
        fieldCatalog={fieldCatalog}
        addCandidateOptions={[]}
        onDefinitionChange={onDefinitionChange}
        onSave={vi.fn()}
      />,
    )

    const remove = screen.getByTestId('campaign-audience-filter-remove-department')
    expect(remove.getAttribute('aria-label')).toBe('Remove filter for Department')

    await user.click(remove)
    expect(onDefinitionChange).toHaveBeenCalledWith({
      filters: [],
      addedEmployeeIds: [],
      excludedEmployeeIds: [],
    })
  })

  it('announces the recipient count via a live region', () => {
    renderWithProviders(
      <AudienceBuilder
        definition={definition}
        preview={{
          fields: fieldCatalog,
          rows: [],
          total: 2,
          page: 1,
          pageSize: 50,
        }}
        fieldCatalog={fieldCatalog}
        addCandidateOptions={[]}
        onDefinitionChange={vi.fn()}
        onSave={vi.fn()}
      />,
    )

    expect(screen.getByTestId('campaign-audience-count').getAttribute('aria-live')).toBe(
      'polite',
    )
  })
})
