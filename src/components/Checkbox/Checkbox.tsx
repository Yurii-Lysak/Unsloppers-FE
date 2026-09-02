import type { ComponentProps, ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { Checkbox as UiCheckbox } from '@/components/ui/checkbox'
import { Label } from '@/components/Label/Label'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/Form/hooks/useFormField'
import { checkboxRootClassName } from './Checkbox.styles'

type BaseCheckboxProps = Omit<
  ComponentProps<typeof UiCheckbox>,
  'name' | 'checked' | 'defaultChecked' | 'onCheckedChange'
>

interface CheckboxFieldProps extends BaseCheckboxProps {
  name: string
  label?: ReactNode
  onCheckedChange?: (checked: boolean) => void
}

interface StandaloneCheckboxProps extends BaseCheckboxProps {
  name?: never
  label?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export type CheckboxProps = CheckboxFieldProps | StandaloneCheckboxProps

const CheckboxField = ({
  name,
  label,
  className,
  id,
  disabled,
  onCheckedChange,
  ...props
}: CheckboxFieldProps) => {
  const { control, errorMessage } = useFormField(name)
  const fieldId = id ?? name
  const errorId = `${fieldId}-error`

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 text-sm">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <UiCheckbox
              id={fieldId}
              className={cn(checkboxRootClassName, className)}
              checked={Boolean(field.value)}
              disabled={disabled}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? errorId : undefined}
              onCheckedChange={checked => {
                field.onChange(checked)
                onCheckedChange?.(checked === true)
              }}
              {...props}
            />
          )}
        />
        {label && <Label htmlFor={fieldId}>{label}</Label>}
      </div>
      {errorMessage && (
        <p id={errorId} className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

const StandaloneCheckbox = ({
  label,
  className,
  id,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  ...props
}: StandaloneCheckboxProps) => (
  <label className="flex items-start gap-2 text-sm">
    <UiCheckbox
      id={id}
      className={cn(checkboxRootClassName, className)}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      {...props}
    />
    {label && <span>{label}</span>}
  </label>
)

export const Checkbox = (props: CheckboxProps) => {
  if ('name' in props && props.name !== undefined) {
    return <CheckboxField {...props} />
  }
  return <StandaloneCheckbox {...props} />
}
