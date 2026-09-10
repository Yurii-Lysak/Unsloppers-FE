import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { usePersonalContactsData } from '@/hooks/data/usePersonalContactsData'
import type { EmergencyContact } from '@/types/employee-profile'
import {
  createEmergencyContactFormSchema,
  type EmergencyContactFormValues,
} from '../schemas/emergency-contact-form.schema'

export const useEmergencyContactItem = (
  employeeId: string,
  contact: EmergencyContact,
) => {
  const { t } = useTranslation()
  const {
    updateEmergencyContact,
    deleteEmergencyContact,
    isMutatingEmergencyContacts,
  } = usePersonalContactsData(employeeId)
  const { schema } = useMemo(() => createEmergencyContactFormSchema(t), [t])
  const defaultValues = useMemo<EmergencyContactFormValues>(
    () => ({
      contactPerson: contact.contactPerson,
      relationship: contact.relationship,
      phone: contact.phone,
    }),
    [contact.contactPerson, contact.phone, contact.relationship],
  )

  const form = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [contact.id, defaultValues, form])

  const isMutating = isMutatingEmergencyContacts || form.formState.isSubmitting

  const onSubmit = async (values: EmergencyContactFormValues) => {
    try {
      await updateEmergencyContact(contact.id, values)
    } catch {
      form.setError('root', { message: t('employeeProfile.s3.saveFailed') })
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('employeeProfile.s3.confirmDelete'))) {
      return
    }

    try {
      await deleteEmergencyContact(contact.id)
    } catch {
      form.setError('root', { message: t('employeeProfile.s3.saveFailed') })
    }
  }

  return { form, onSubmit, isMutating, handleDelete }
}

export const useAddEmergencyContactForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createEmergencyContact, isMutatingEmergencyContacts } =
    usePersonalContactsData(employeeId)
  const { schema } = useMemo(() => createEmergencyContactFormSchema(t), [t])

  const form = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contactPerson: '',
      relationship: '',
      phone: '',
    },
  })

  const isMutating = isMutatingEmergencyContacts || form.formState.isSubmitting

  const onSubmit = async (values: EmergencyContactFormValues) => {
    try {
      await createEmergencyContact(values)
      form.reset({ contactPerson: '', relationship: '', phone: '' })
    } catch {
      form.setError('root', { message: t('employeeProfile.s3.saveFailed') })
    }
  }

  return { form, onSubmit, isMutating }
}
