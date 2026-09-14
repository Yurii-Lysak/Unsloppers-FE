// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EditableCell } from '@/pages/AllEmployeesPage/components/EditableCell/EditableCell'
import { renderWithProviders } from '@/test-utils/test-render'
import type { FieldSpec } from '@/types/employees'

const relationshipField = (id: string): FieldSpec => ({
  id,
  name: id,
  type: 'text',
  source: 'builtin',
  sortable: false,
  filterable: false,
  editable: true,
})

describe('EditableCell relationship guard', () => {
  it.each(['managerId', 'peoplePartnerId', 'department'])(
    'renders the reject-and-route hint for %s even when writable and editable',
    fieldId => {
      renderWithProviders(
        <EditableCell
          field={relationshipField(fieldId)}
          value="Engineering"
          writable
          displayValue="Engineering"
          onSave={vi.fn()}
        />,
      )

      expect(
        screen.getByTestId(`directory-cell-guard-${fieldId}`).textContent,
      ).toContain('Changes to this field are made on the dedicated relationship screen.')
      expect(screen.queryByTestId(`directory-cell-${fieldId}`)).toBeNull()
      expect(screen.queryByTestId(`directory-cell-editor-${fieldId}`)).toBeNull()
    },
  )

  it('keeps the inline editor for ordinary writable fields', () => {
    renderWithProviders(
      <EditableCell
        field={{ ...relationshipField('position'), editable: true }}
        value="Engineer"
        writable
        displayValue="Engineer"
        onSave={vi.fn()}
      />,
    )

    expect(screen.getByTestId('directory-cell-position')).not.toBeNull()
  })
})
