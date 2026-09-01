import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEmployeesList } from '@/api/hooks/useEmployees'

export const EmployeesPage = () => {
  const { t } = useTranslation()
  const employeesQuery = useEmployeesList()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground" data-testid="employees-title">
          {t('employees.title')}
        </h1>
      </div>

      {employeesQuery.isLoading && (
        <p className="text-muted-foreground">{t('employees.loading')}</p>
      )}

      {employeesQuery.isError && (
        <p className="text-destructive">{t('employees.loadFailed')}</p>
      )}

      {employeesQuery.data?.length === 0 && (
        <p className="text-muted-foreground" data-testid="employees-empty">
          {t('employees.empty')}
        </p>
      )}

      {employeesQuery.data && employeesQuery.data.length > 0 && (
        <ul
          className="divide-y divide-border rounded-lg border border-border"
          data-testid="employees-list"
        >
          {employeesQuery.data.map(employee => (
            <li key={employee.id}>
              <Link
                to={`/employees/${employee.id}`}
                className="block p-4 hover:bg-muted/50"
                data-testid={`employee-link-${employee.id}`}
              >
                {employee.displayName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
