import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useRisksData } from '@/hooks/data/useRisksData'
import {
  createAddRiskRecordFormSchema,
  type AddRiskRecordFormValues,
} from '../schemas/risk-record-form.schema'

const defaultRecordedAt = (): string => new Date().toISOString().slice(0, 10)

export const useAddRiskRecordForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createRecord, isCreatingRecord } = useRisksData(employeeId)
  const { schema } = useMemo(() => createAddRiskRecordFormSchema(t), [t])

  const form = useForm<AddRiskRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      level: 'low',
      description: '',
      details: '',
      recordedAt: defaultRecordedAt(),
    },
  })

  const onSubmit = async (values: AddRiskRecordFormValues) => {
    try {
      await createRecord({
        level: values.level,
        description: values.description,
        details: values.details,
        recordedAt: values.recordedAt,
      })
      form.reset({
        level: 'low',
        description: '',
        details: '',
        recordedAt: defaultRecordedAt(),
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s6.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isCreatingRecord,
  }
}
