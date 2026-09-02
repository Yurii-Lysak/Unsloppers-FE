import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

export const useFormField = <TFieldValues extends FieldValues>(
  name: FieldPath<TFieldValues>,
) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>()
  const error = errors[name]
  const errorMessage =
    error?.message !== undefined ? String(error.message) : undefined

  return { control, error, errorMessage }
}
