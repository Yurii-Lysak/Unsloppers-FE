import type { ComponentProps, ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { Textarea as UiTextarea } from '@/components/ui/textarea'
import { Label } from '@/components/Label/Label'
import { cn } from '@/lib/utils'
import { useFormField } from '@/components/Form/hooks/useFormField'
import { textareaRootClassName } from './Textarea.styles'

type BaseTextareaProps = Omit<ComponentProps<typeof UiTextarea>, 'name'>

interface TextareaFieldProps extends BaseTextareaProps {
  name: string
  label?: ReactNode
}

interface StandaloneTextareaProps extends BaseTextareaProps {
  name?: never
  label?: ReactNode
}

export type TextareaProps = TextareaFieldProps | StandaloneTextareaProps

const TextareaField = ({
  name,
  label,
  className,
  id,
  onChange,
  ...props
}: TextareaFieldProps) => {
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
          <UiTextarea
            id={fieldId}
            className={cn(textareaRootClassName, className)}
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

const StandaloneTextarea = ({
  label,
  className,
  id,
  ...props
}: StandaloneTextareaProps) => (
  <div className="space-y-2">
    {label && id && <Label htmlFor={id}>{label}</Label>}
    {label && !id && <Label>{label}</Label>}
    <UiTextarea
      id={id}
      className={cn(textareaRootClassName, className)}
      {...props}
    />
  </div>
)

export const Textarea = (props: TextareaProps) => {
  if ('name' in props && props.name !== undefined) {
    return <TextareaField {...props} />
  }
  return <StandaloneTextarea {...props} />
}
