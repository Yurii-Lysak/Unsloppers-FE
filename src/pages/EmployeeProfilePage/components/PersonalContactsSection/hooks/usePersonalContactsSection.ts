import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { usePersonalContactsData } from '@/hooks/data/usePersonalContactsData'
import type { PersonalContactMethod } from '@/types/employee-profile'
import {
  createAddressFormSchema,
  createContactMethodFormSchema,
  type AddressFormValues,
  type ContactMethodFormValues,
} from '../schemas/personal-contact-form.schema'

const CONTACT_TYPE_OPTIONS = [
  { value: 'PHONE', labelKey: 'employeeProfile.s2.types.phone' },
  { value: 'EMAIL', labelKey: 'employeeProfile.s2.types.email' },
  { value: 'MESSENGER', labelKey: 'employeeProfile.s2.types.messenger' },
] as const

export const useContactMethodItem = (
  employeeId: string,
  method: PersonalContactMethod,
) => {
  const { t } = useTranslation()
  const { updateContactMethod, deleteContactMethod, isMutatingPersonalContacts } =
    usePersonalContactsData(employeeId)
  const { schema } = useMemo(() => createContactMethodFormSchema(t), [t])
  const defaultValues = useMemo<ContactMethodFormValues>(
    () => ({
      type: method.type,
      label: method.label,
      value: method.value,
    }),
    [method.label, method.type, method.value],
  )

  const form = useForm<ContactMethodFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form, method.id])

  const isMutating = isMutatingPersonalContacts || form.formState.isSubmitting

  const onSubmit = async (values: ContactMethodFormValues) => {
    try {
      await updateContactMethod(method.id, values)
    } catch {
      form.setError('root', { message: t('employeeProfile.s2.saveFailed') })
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('employeeProfile.s2.confirmDelete'))) {
      return
    }

    try {
      await deleteContactMethod(method.id)
    } catch {
      form.setError('root', { message: t('employeeProfile.s2.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isMutating,
    handleDelete,
    typeOptions: CONTACT_TYPE_OPTIONS.map((option) => ({
      value: option.value,
      label: t(option.labelKey),
    })),
  }
}

export const useAddContactMethodForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createContactMethod, isMutatingPersonalContacts } =
    usePersonalContactsData(employeeId)
  const { schema } = useMemo(() => createContactMethodFormSchema(t), [t])

  const form = useForm<ContactMethodFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'PHONE',
      label: '',
      value: '',
    },
  })

  const isMutating = isMutatingPersonalContacts || form.formState.isSubmitting

  const onSubmit = async (values: ContactMethodFormValues) => {
    try {
      await createContactMethod(values)
      form.reset({ type: 'PHONE', label: '', value: '' })
    } catch {
      form.setError('root', { message: t('employeeProfile.s2.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isMutating,
    typeOptions: CONTACT_TYPE_OPTIONS.map((option) => ({
      value: option.value,
      label: t(option.labelKey),
    })),
  }
}

export const useAddressFields = (
  employeeId: string,
  residentialAddress: string | null,
  placeOfStay: string | null,
  canWrite: boolean,
) => {
  const { t } = useTranslation()
  const { patchAddress, isMutatingPersonalContacts } =
    usePersonalContactsData(employeeId)
  const { schema } = useMemo(() => createAddressFormSchema(t), [t])
  const defaultValues = useMemo<AddressFormValues>(
    () => ({
      residentialAddress: residentialAddress ?? '',
      placeOfStay: placeOfStay ?? '',
    }),
    [placeOfStay, residentialAddress],
  )

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const isMutating = isMutatingPersonalContacts || form.formState.isSubmitting

  const onSubmit = async (values: AddressFormValues) => {
    if (!canWrite) {
      return
    }

    try {
      await patchAddress({
        residentialAddress: values.residentialAddress.trim() || null,
        placeOfStay: values.placeOfStay.trim() || null,
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s2.saveFailed') })
    }
  }

  return { form, onSubmit, isMutating }
}
