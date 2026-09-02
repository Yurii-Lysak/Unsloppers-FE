import type { ComponentProps, ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { Input as UiInput } from '@/components/ui/input'
import { Label } from '@/components/Label/Label'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/Form/hooks/useFormField'
import { inputRootClassName } from './Input.styles'

type BaseInputProps = Omit<ComponentProps<typeof UiInput>, 'name'>

interface InputFieldProps extends BaseInputProps {
  name: string
  label?: ReactNode
}

interface StandaloneInputProps extends BaseInputProps {
  name?: never
  label?: ReactNode
}

export type InputProps = InputFieldProps | StandaloneInputProps

const InputField = ({
  name,
  label,
  className,
  id,
  onChange,
  ...props
}: InputFieldProps) => {
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
          <UiInput
            id={fieldId}
            className={cn(inputRootClassName, className)}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorId : undefined}
            {...field}
            {...props}
            onChange={event => {
              field.onChange(event)
              onChange?.(event)
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

const StandaloneInput = ({
  label,
  className,
  id,
  ...props
}: StandaloneInputProps) => (
  <div className="space-y-2">
    {label && id && <Label htmlFor={id}>{label}</Label>}
    {label && !id && <Label>{label}</Label>}
    <UiInput
      id={id}
      className={cn(inputRootClassName, className)}
      {...props}
    />
  </div>
)

export const Input = (props: InputProps) => {
  if ('name' in props && props.name !== undefined) {
    return <InputField {...props} />
  }
  return <StandaloneInput {...props} />
}
