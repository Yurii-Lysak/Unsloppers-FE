import { Filter } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/Popover/Popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { EmployeeFieldFilter, FieldSpec, FilterOperator } from '@/types/employees'
import { defaultFilterOperatorForType } from '../../hooks/useAllEmployeesPage'

interface ColumnFilterPopoverProps {
  field: FieldSpec
  activeFilter?: EmployeeFieldFilter
  onApply: (filter: EmployeeFieldFilter) => void
  onClear: () => void
}

const operatorsForField = (field: FieldSpec): FilterOperator[] => {
  if (field.type === 'number') {
    return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte']
  }
  if (field.type === 'boolean') {
    return ['eq']
  }
  if (field.type === 'multi_select') {
    return ['in', 'eq', 'neq']
  }
  if (field.type === 'select') {
    return ['eq', 'neq', 'in']
  }
  if (field.type === 'date') {
    return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte']
  }
  return ['eq', 'neq', 'contains']
}

const valueToString = (value: EmployeeFieldFilter['value'] | undefined): string => {
  if (value === null || value === undefined) {
    return ''
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return String(value)
}

const valueToSelectedOptions = (
  value: EmployeeFieldFilter['value'] | undefined,
): string[] => {
  if (Array.isArray(value)) {
    return value.map(String)
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value]
  }
  return []
}

export const ColumnFilterPopover = ({
  field,
  activeFilter,
  onApply,
  onClear,
}: ColumnFilterPopoverProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [operator, setOperator] = useState<FilterOperator>(
    activeFilter?.operator ?? defaultFilterOperatorForType(field.type),
  )
  const [value, setValue] = useState(valueToString(activeFilter?.value))
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    valueToSelectedOptions(activeFilter?.value),
  )

  const operators = operatorsForField(field)
  const hasOptions = (field.options?.length ?? 0) > 0
  const usesOptionPicker =
    hasOptions && (field.type === 'select' || field.type === 'multi_select')
  const usesMultiOptionPicker = usesOptionPicker && operator === 'in'

  const syncFromActiveFilter = () => {
    setOperator(activeFilter?.operator ?? defaultFilterOperatorForType(field.type))
    setValue(valueToString(activeFilter?.value))
    setSelectedOptions(valueToSelectedOptions(activeFilter?.value))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      syncFromActiveFilter()
    }
    setOpen(nextOpen)
  }

  const toggleOption = (option: string) => {
    setSelectedOptions(current =>
      current.includes(option)
        ? current.filter(entry => entry !== option)
        : [...current, option],
    )
  }

  const apply = () => {
    let parsedValue: EmployeeFieldFilter['value'] = value

    if (usesMultiOptionPicker) {
      if (selectedOptions.length === 0) {
        return
      }
      parsedValue = selectedOptions
    } else if (usesOptionPicker) {
      if (!value) {
        return
      }
      parsedValue = value
    } else if (field.type === 'number') {
      parsedValue = Number(value)
      if (Number.isNaN(parsedValue)) {
        return
      }
    } else if (field.type === 'boolean') {
      parsedValue = value === 'true'
    } else if (!value) {
      return
    }

    onApply({
      fieldId: field.id,
      operator,
      value: parsedValue,
    })
    setOpen(false)
  }

  const handleClear = () => {
    onClear()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={activeFilter ? 'secondary' : 'ghost'}
          size="icon-xs"
          aria-label={t('directory.filterColumn', { column: field.name })}
          data-testid={`directory-filter-${field.id}`}
        >
          <Filter className="size-3.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start">
        <PopoverTitle>{field.name}</PopoverTitle>

        <div className="mt-3 space-y-2">
          <Label htmlFor={`filter-operator-${field.id}`}>
            {t('directory.filterOperator')}
          </Label>
          <select
            id={`filter-operator-${field.id}`}
            className="h-8 w-full rounded-lg border border-border bg-background px-2 text-sm"
            value={operator}
            onChange={event => setOperator(event.target.value as FilterOperator)}
          >
            {operators.map(entry => (
              <option key={entry} value={entry}>
                {t(`directory.operators.${entry}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 space-y-2">
          <Label htmlFor={`filter-value-${field.id}`}>{t('directory.filterValue')}</Label>
          {field.type === 'boolean' ? (
            <select
              id={`filter-value-${field.id}`}
              className="h-8 w-full rounded-lg border border-border bg-background px-2 text-sm"
              value={value}
              onChange={event => setValue(event.target.value)}
            >
              <option value="true">{t('directory.boolean.true')}</option>
              <option value="false">{t('directory.boolean.false')}</option>
            </select>
          ) : usesMultiOptionPicker ? (
            <div className="space-y-1" id={`filter-value-${field.id}`}>
              {field.options?.map(option => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : usesOptionPicker ? (
            <select
              id={`filter-value-${field.id}`}
              className="h-8 w-full rounded-lg border border-border bg-background px-2 text-sm"
              value={value}
              onChange={event => setValue(event.target.value)}
            >
              <option value="">{t('directory.selectOption')}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={`filter-value-${field.id}`}
              value={value}
              onChange={event => setValue(event.target.value)}
              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            />
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          {activeFilter && (
            <Button type="button" variant="outline" size="sm" onClick={handleClear}>
              {t('directory.clearFilter')}
            </Button>
          )}
          <Button type="button" size="sm" onClick={apply}>
            {t('directory.applyFilter')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
