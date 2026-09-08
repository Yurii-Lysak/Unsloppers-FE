import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { ColumnFilterPopover } from '@/components/AudienceBuilder/ColumnFilterPopover/ColumnFilterPopover'
import { formatCellValue } from '@/components/AudienceBuilder/filter-utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BUILTIN_FIELD_IDS } from '@/types/employees'
import type {
  CampaignAudiencePreview,
  CampaignAudienceDefinition,
} from '@/types/campaigns'
import type { EmployeeFieldFilter, FieldSpec } from '@/types/employees'

interface AudienceBuilderProps {
  definition: CampaignAudienceDefinition
  preview?: CampaignAudiencePreview
  fieldCatalog?: FieldSpec[]
  isPreviewLoading?: boolean
  addCandidateOptions: Array<{ value: string; label: string }>
  onDefinitionChange: (definition: CampaignAudienceDefinition) => void
  onSave: () => void
  isSaving?: boolean
}

export const AudienceBuilder = ({
  definition,
  preview,
  fieldCatalog,
  isPreviewLoading,
  addCandidateOptions,
  onDefinitionChange,
  onSave,
  isSaving = false,
}: AudienceBuilderProps) => {
  const { t } = useTranslation()

  const filterableFields = useMemo(
    () => fieldCatalog?.filter(field => field.filterable) ?? [],
    [fieldCatalog],
  )

  const activeFilterForField = useCallback(
    (fieldId: string) => definition.filters.find(filter => filter.fieldId === fieldId),
    [definition.filters],
  )

  const upsertFilter = (filter: EmployeeFieldFilter) => {
    const next = definition.filters.filter(entry => entry.fieldId !== filter.fieldId)
    onDefinitionChange({
      ...definition,
      filters: [...next, filter],
    })
  }

  const clearFilter = (fieldId: string) => {
    onDefinitionChange({
      ...definition,
      filters: definition.filters.filter(entry => entry.fieldId !== fieldId),
    })
  }

  const removeResolvedEmployee = (employeeId: string) => {
    if (definition.addedEmployeeIds.includes(employeeId)) {
      onDefinitionChange({
        ...definition,
        addedEmployeeIds: definition.addedEmployeeIds.filter(id => id !== employeeId),
      })
      return
    }
    if (!definition.excludedEmployeeIds.includes(employeeId)) {
      onDefinitionChange({
        ...definition,
        excludedEmployeeIds: [...definition.excludedEmployeeIds, employeeId],
      })
    }
  }

  const addEmployee = (employeeId: string) => {
    if (!employeeId) {
      return
    }
    onDefinitionChange({
      ...definition,
      addedEmployeeIds: [...new Set([...definition.addedEmployeeIds, employeeId])],
      excludedEmployeeIds: definition.excludedEmployeeIds.filter(id => id !== employeeId),
    })
  }

  const displayFields = fieldCatalog ?? preview?.fields ?? []

  return (
    <div className="space-y-4" data-testid="campaign-audience-builder">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" data-testid="campaign-audience-count">
          {t('campaigns.audience.count', { count: preview?.total ?? 0 })}
        </p>
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          data-testid="campaign-audience-save"
        >
          {isSaving ? t('campaigns.saving') : t('campaigns.audience.save')}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterableFields.map((field: FieldSpec) => (
          <div key={field.id} className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
            <span className="text-sm">{field.name}</span>
            <ColumnFilterPopover
              field={field}
              activeFilter={activeFilterForField(field.id)}
              onApply={upsertFilter}
              onClear={() => clearFilter(field.id)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-sm">
          {t('campaigns.audience.addEmployee')}
          <select
            className="min-w-56 rounded-md border border-border bg-background px-3 py-2 text-sm"
            defaultValue=""
            onChange={event => {
              addEmployee(event.target.value)
              event.target.value = ''
            }}
            data-testid="campaign-audience-add-select"
          >
            <option value="">{t('campaigns.audience.selectEmployee')}</option>
            {addCandidateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isPreviewLoading && (
        <p className="text-sm text-muted-foreground">{t('campaigns.audience.loadingPreview')}</p>
      )}

      {preview && displayFields.length > 0 && (
        <Table data-testid="campaign-audience-preview-table">
          <TableHeader>
            <TableRow>
              {displayFields.map(field => (
                <TableHead key={field.id}>{field.name}</TableHead>
              ))}
              <TableHead>{t('campaigns.audience.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={displayFields.length + 1}
                  className="py-6 text-center text-muted-foreground"
                >
                  {t('campaigns.audience.emptyPreview')}
                </TableCell>
              </TableRow>
            ) : (
              preview.rows.map(row => (
                <TableRow key={row.employeeId} data-testid={`campaign-audience-row-${row.employeeId}`}>
                  {displayFields.map(field => (
                    <TableCell key={field.id}>
                      {field.id === BUILTIN_FIELD_IDS.name
                        ? formatCellValue(row.cells[field.id], t)
                        : formatCellValue(row.cells[field.id], t)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeResolvedEmployee(row.employeeId)}
                      data-testid={`campaign-audience-remove-${row.employeeId}`}
                    >
                      {t('campaigns.audience.remove')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
