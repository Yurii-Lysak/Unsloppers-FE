import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { EmployeeListResponse } from '@/types/employees'
import { ColumnFilterPopover } from '../ColumnFilterPopover/ColumnFilterPopover'
import { formatCellValue } from '../../hooks/useAllEmployeesPage'

interface EmployeeTableProps {
  data: EmployeeListResponse
  sort?: string
  order?: 'asc' | 'desc'
  onToggleSort: (fieldId: string) => void
  onApplyFilter: (filter: {
    fieldId: string
    operator: import('@/types/employees').FilterOperator
    value: import('@/types/employees').FieldValue | string[]
  }) => void
  onClearFilter: (fieldId: string) => void
  activeFilterForField: (fieldId: string) =>
    | {
        fieldId: string
        operator: import('@/types/employees').FilterOperator
        value: import('@/types/employees').FieldValue | string[]
      }
    | undefined
}

export const EmployeeTable = ({
  data,
  sort,
  order,
  onToggleSort,
  onApplyFilter,
  onClearFilter,
  activeFilterForField,
}: EmployeeTableProps) => {
  const { t } = useTranslation()

  const sortIcon = (fieldId: string) => {
    if (sort !== fieldId) {
      return <ArrowUpDown className="size-3.5 text-muted-foreground" />
    }
    return order === 'desc' ? (
      <ArrowDown className="size-3.5" />
    ) : (
      <ArrowUp className="size-3.5" />
    )
  }

  return (
    <Table data-testid="directory-table">
      <TableHeader>
        <TableRow>
          {data.fields.map(field => (
            <TableHead key={field.id}>
              <div className="flex items-center gap-1">
                {field.sortable ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-left"
                    onClick={() => onToggleSort(field.id)}
                    data-testid={`directory-sort-${field.id}`}
                  >
                    <span>{field.name}</span>
                    {sortIcon(field.id)}
                  </button>
                ) : (
                  <span>{field.name}</span>
                )}
                {field.filterable && (
                  <ColumnFilterPopover
                    field={field}
                    activeFilter={activeFilterForField(field.id)}
                    onApply={onApplyFilter}
                    onClear={() => onClearFilter(field.id)}
                  />
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={data.fields.length} className="py-8 text-center text-muted-foreground">
              {t('directory.emptyFiltered')}
            </TableCell>
          </TableRow>
        ) : (
          data.rows.map(row => (
            <TableRow key={row.employeeId} data-testid={`directory-row-${row.employeeId}`}>
              {data.fields.map(field => (
                <TableCell key={field.id}>
                  {formatCellValue(row.cells[field.id], t)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
