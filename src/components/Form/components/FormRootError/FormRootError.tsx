import { useFormContext } from 'react-hook-form'

export const FormRootError = () => {
  const {
    formState: { errors },
  } = useFormContext()
  const message = errors.root?.message

  if (!message) {
    return null
  }

  return (
    <p role="alert" className="text-sm text-destructive">
      {String(message)}
    </p>
  )
}
