import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BUILTIN_FIELD_IDS, type EmployeeListResponse } from '@/types/employees'
import { formatCellValue } from '@/components/AudienceBuilder/filter-utils'

interface EmployeeCardListProps {
  data: EmployeeListResponse
}

export const EmployeeCardList = ({ data }: EmployeeCardListProps) => {
  const { t } = useTranslation()

  const detailFields = data.fields.filter(field => field.id !== BUILTIN_FIELD_IDS.name)

  if (data.rows.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground" data-testid="directory-card-empty">
        {t('directory.emptyFiltered')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 md:hidden" data-testid="directory-card-list">
      {data.rows.map(row => {
        const nameValue = formatCellValue(row.cells[BUILTIN_FIELD_IDS.name], t)

        return (
          <Link
            key={row.employeeId}
            to={`/employees/${row.employeeId}`}
            className="block rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40"
            data-testid={`directory-card-${row.employeeId}`}
          >
            <p className="font-medium text-primary">{nameValue}</p>
            {detailFields.length > 0 && (
              <dl className="mt-3 space-y-2">
                {detailFields.map(field => (
                  <div key={field.id} className="flex items-start justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground">{field.name}</dt>
                    <dd className="text-right text-foreground">
                      {formatCellValue(row.cells[field.id], t, field.id)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Link>
        )
      })}
    </div>
  )
}
