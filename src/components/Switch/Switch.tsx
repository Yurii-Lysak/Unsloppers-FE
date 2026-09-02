import type { ComponentProps, ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { Switch as UiSwitch } from '@/components/ui/switch'
import { Label } from '@/components/Label/Label'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/Form/hooks/useFormField'
import { switchRootClassName } from './Switch.styles'

type BaseSwitchProps = Omit<
  ComponentProps<typeof UiSwitch>,
  'name' | 'checked' | 'defaultChecked' | 'onCheckedChange'
>

interface SwitchFieldProps extends BaseSwitchProps {
  name: string
  label?: ReactNode
  onCheckedChange?: (checked: boolean) => void
}

interface StandaloneSwitchProps extends BaseSwitchProps {
  name?: never
  label?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export type SwitchProps = SwitchFieldProps | StandaloneSwitchProps

const SwitchField = ({
  name,
  label,
  className,
  id,
  disabled,
  onCheckedChange,
  ...props
}: SwitchFieldProps) => {
  const { control, errorMessage } = useFormField(name)
  const fieldId = id ?? name
  const errorId = `${fieldId}-error`

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <UiSwitch
              id={fieldId}
              className={cn(switchRootClassName, className)}
              checked={Boolean(field.value)}
              disabled={disabled}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? errorId : undefined}
              onCheckedChange={checked => {
                field.onChange(checked)
                onCheckedChange?.(checked)
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

const StandaloneSwitch = ({
  label,
  className,
  id,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  ...props
}: StandaloneSwitchProps) => (
  <div className="flex items-center gap-2">
    <UiSwitch
      id={id}
      className={cn(switchRootClassName, className)}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      {...props}
    />
    {label && id && <Label htmlFor={id}>{label}</Label>}
    {label && !id && <Label>{label}</Label>}
  </div>
)

export const Switch = (props: SwitchProps) => {
  if ('name' in props && props.name !== undefined) {
    return <SwitchField {...props} />
  }
  return <StandaloneSwitch {...props} />
}
