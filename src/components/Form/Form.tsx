import type { FormHTMLAttributes, ReactNode } from 'react'
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form'
import { cn } from '@/lib/utils'

interface FormProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  children: ReactNode
}

export const Form = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  noValidate = true,
  ...props
}: FormProps<TFieldValues>) => (
  <FormProvider {...form}>
    <form
      className={cn(className)}
      noValidate={noValidate}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      {children}
    </form>
  </FormProvider>
)
