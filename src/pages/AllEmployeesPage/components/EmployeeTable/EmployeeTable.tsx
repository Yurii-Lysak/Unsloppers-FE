import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/Button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BUILTIN_FIELD_IDS, type EmployeeListResponse, type FieldValue } from '@/types/employees'
import { ColumnFilterPopover } from '../ColumnFilterPopover/ColumnFilterPopover'
import { EditableCell } from '../EditableCell/EditableCell'
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
  onSaveField: (employeeId: string, fieldId: string, value: FieldValue) => Promise<void>
  isSavingField?: boolean
}

export const EmployeeTable = ({
  data,
  sort,
  order,
  onToggleSort,
  onApplyFilter,
  onClearFilter,
  activeFilterForField,
  onSaveField,
  isSavingField = false,
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

  const isWritable = (row: EmployeeListResponse['rows'][number], fieldId: string) =>
    row.writableFieldIds?.includes(fieldId) ?? false

  return (
    <Table data-testid="directory-table">
      <TableHeader>
        <TableRow>
          {data.fields.map(field => (
            <TableHead key={field.id}>
              <div className="flex items-center gap-1">
                {field.sortable ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="inline-flex h-auto items-center gap-1 px-0 text-left font-normal hover:bg-transparent"
                    onClick={() => onToggleSort(field.id)}
                    data-testid={`directory-sort-${field.id}`}
                  >
                    <span>{field.name}</span>
                    {sortIcon(field.id)}
                  </Button>
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
              {data.fields.map(field =>
                field.id === BUILTIN_FIELD_IDS.name ? (
                  <TableCell key={field.id}>
                    <Link
                      to={`/employees/${row.employeeId}`}
                      className="font-medium text-primary hover:underline"
                      data-testid={`directory-employee-link-${row.employeeId}`}
                    >
                      {formatCellValue(row.cells[field.id], t)}
                    </Link>
                  </TableCell>
                ) : (
                  <TableCell key={field.id}>
                    <EditableCell
                      field={field}
                      value={row.cells[field.id] ?? null}
                      writable={isWritable(row, field.id)}
                      displayValue={formatCellValue(row.cells[field.id], t)}
                      onSave={value => onSaveField(row.employeeId, field.id, value)}
                      isSavingExternal={isSavingField}
                    />
                  </TableCell>
                ),
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
