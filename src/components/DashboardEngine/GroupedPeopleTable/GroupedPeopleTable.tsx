import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScopedPeopleTable } from '@/components/DashboardEngine/ScopedPeopleTable/ScopedPeopleTable'
import { Button } from '@/components/ui/button'
import type { DashboardTableRow } from '@/types/dashboard'

type GroupByMode = 'department' | 'project'

interface GroupedPeopleTableProps {
  rows: DashboardTableRow[]
}

const normalizeGroupKey = (label?: string): string => {
  const trimmed = label?.trim() ?? ''
  return trimmed.length === 0 ? '' : trimmed.toLowerCase()
}

const buildGroups = (
  rows: DashboardTableRow[],
  mode: GroupByMode,
  unassignedLabel: string,
): Array<{ key: string; label: string; rows: DashboardTableRow[] }> => {
  const groups = new Map<string, { label: string; rows: DashboardTableRow[] }>()

  for (const row of rows) {
    const rawLabel = mode === 'department' ? row.departmentLabel : row.projectLabel
    const statusField = mode === 'department' ? 'departmentStatus' : 'projectStatus'
    const isAvailable = row[statusField] === 'available'
    const hasLabel = Boolean(rawLabel?.trim())
    const normalizedKey = isAvailable && hasLabel ? normalizeGroupKey(rawLabel) : ''
    const displayLabel = isAvailable && hasLabel ? rawLabel!.trim() : unassignedLabel

    const existing = groups.get(normalizedKey)
    if (existing) {
      existing.rows.push(row)
      continue
    }

    groups.set(normalizedKey, {
      label: displayLabel,
      rows: [row],
    })
  }

  return [...groups.entries()]
    .sort(([leftKey], [rightKey]) => {
      if (leftKey === '') {
        return 1
      }
      if (rightKey === '') {
        return -1
      }
      return leftKey.localeCompare(rightKey)
    })
    .map(([key, group]) => ({ key, ...group }))
}

export const GroupedPeopleTable = ({ rows }: GroupedPeopleTableProps) => {
  const { t } = useTranslation()
  const [groupBy, setGroupBy] = useState<GroupByMode>('department')
  const unassignedLabel = t('dashboard.table.unassignedGroup')

  const groups = useMemo(
    () => buildGroups(rows, groupBy, unassignedLabel),
    [groupBy, rows, unassignedLabel],
  )

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-table-empty">
        {t('dashboard.table.empty')}
      </p>
    )
  }

  return (
    <div className="space-y-4" data-testid="dashboard-grouped-table">
      <div
        className="flex flex-wrap items-center gap-2"
        data-testid="dashboard-group-by-toggle"
      >
        <span className="text-sm text-muted-foreground">
          {t('dashboard.table.groupByLabel')}
        </span>
        <Button
          type="button"
          size="sm"
          variant={groupBy === 'department' ? 'default' : 'outline'}
          onClick={() => setGroupBy('department')}
          data-testid="dashboard-group-by-department"
        >
          {t('dashboard.table.groupByDepartment')}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={groupBy === 'project' ? 'default' : 'outline'}
          onClick={() => setGroupBy('project')}
          data-testid="dashboard-group-by-project"
        >
          {t('dashboard.table.groupByProject')}
        </Button>
      </div>

      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.key || 'unassigned'} data-testid={`dashboard-client-group-${group.key || 'unassigned'}`}>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">{group.label}</h3>
            <ScopedPeopleTable rows={group.rows} variant="pp" />
          </div>
        ))}
      </div>
    </div>
  )
}
