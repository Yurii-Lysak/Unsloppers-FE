import type { ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as UiSelect,
} from '@/components/ui/select'
import { Label } from '@/components/Label/Label'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/Form/hooks/useFormField'
import { selectTriggerClassName } from './Select.styles'

export interface SelectOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

interface BaseSelectProps {
  label?: ReactNode
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  onValueChange?: (value: string) => void
}

interface SelectFieldProps extends BaseSelectProps {
  name: string
  value?: never
}

interface StandaloneSelectProps extends BaseSelectProps {
  name?: never
  value: string
  onValueChange: (value: string) => void
}

export type SelectProps = SelectFieldProps | StandaloneSelectProps

const SelectControl = ({
  id,
  value,
  options,
  placeholder,
  disabled,
  className,
  errorMessage,
  onValueChange,
}: {
  id?: string
  value: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  errorMessage?: string
  onValueChange: (value: string) => void
}) => (
  <UiSelect
    value={value || undefined}
    disabled={disabled}
    onValueChange={onValueChange}
  >
    <SelectTrigger
      id={id}
      className={cn(selectTriggerClassName, className)}
      aria-invalid={Boolean(errorMessage)}
      aria-describedby={errorMessage && id ? `${id}-error` : undefined}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map(option => (
        <SelectItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </UiSelect>
)

const SelectField = ({
  name,
  label,
  options,
  placeholder,
  disabled,
  id,
  className,
  onValueChange,
}: SelectFieldProps) => {
  const { control, errorMessage } = useFormField(name)
  const fieldId = id ?? name
  const errorId = `${fieldId}-error`

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SelectControl
            id={fieldId}
            value={field.value ?? ''}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            errorMessage={errorMessage}
            onValueChange={value => {
              field.onChange(value)
              onValueChange?.(value)
            }}
          />
        )}
      />
      {errorMessage && (
        <p id={errorId} className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

const StandaloneSelect = ({
  label,
  value,
  options,
  placeholder,
  disabled,
  id,
  className,
  onValueChange,
}: StandaloneSelectProps) => (
  <div className="space-y-2">
    {label && id && <Label htmlFor={id}>{label}</Label>}
    {label && !id && <Label>{label}</Label>}
    <SelectControl
      id={id}
      value={value}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      onValueChange={onValueChange}
    />
  </div>
)

export const Select = (props: SelectProps) => {
  if ('name' in props && props.name !== undefined) {
    return <SelectField {...props} />
  }
  return <StandaloneSelect {...props} />
}
