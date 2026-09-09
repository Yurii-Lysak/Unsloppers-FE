import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCdsData } from '@/hooks/data/useCdsData'
import type { CdsAssessmentEntry, IdpRecord } from '@/types/employee-profile'
import {
  createAddCdsAssessmentFormSchema,
  createEditCdsAssessmentConclusionFormSchema,
  type AddCdsAssessmentFormValues,
  type EditCdsAssessmentConclusionFormValues,
} from '../schemas/cds-assessment-form.schema'
import {
  createAddIdpRecordFormSchema,
  createEditIdpRecordFormSchema,
  type AddIdpRecordFormValues,
  type EditIdpRecordFormValues,
} from '../schemas/idp-record-form.schema'

const defaultDeadline = (): string => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + 30)
  return date.toISOString().slice(0, 10)
}

export const useAddIdpRecordForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createIdpRecord, isCreatingIdpRecord } = useCdsData(employeeId)
  const { schema } = useMemo(() => createAddIdpRecordFormSchema(t), [t])

  const form = useForm<AddIdpRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      deadline: defaultDeadline(),
      fileUrl: '',
    },
  })

  const onSubmit = async (values: AddIdpRecordFormValues) => {
    try {
      await createIdpRecord(values)
      form.reset({
        description: '',
        deadline: defaultDeadline(),
        fileUrl: '',
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s12.idp.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isCreatingIdpRecord,
  }
}

export const useIdpRecordItem = (employeeId: string, record: IdpRecord) => {
  const { t } = useTranslation()
  const { updateIdpRecord, isUpdatingIdpRecord } = useCdsData(employeeId)
  const { schema } = useMemo(() => createEditIdpRecordFormSchema(t), [t])
  const defaultValues = useMemo<EditIdpRecordFormValues>(
    () => ({
      description: record.description,
      deadline: record.deadline,
      fileUrl: record.fileUrl,
    }),
    [record.description, record.deadline, record.fileUrl],
  )

  const form = useForm<EditIdpRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form, record.id])

  const onSubmit = async (values: EditIdpRecordFormValues) => {
    try {
      await updateIdpRecord(record.id, values)
    } catch {
      form.setError('root', { message: t('employeeProfile.s12.idp.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isUpdatingIdpRecord,
  }
}

const defaultAssessmentDate = (): string => new Date().toISOString().slice(0, 10)

export const useAddCdsAssessmentForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createAssessment, isCreatingAssessment } = useCdsData(employeeId)
  const { schema } = useMemo(() => createAddCdsAssessmentFormSchema(t), [t])

  const form = useForm<AddCdsAssessmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: defaultAssessmentDate(),
      assessor: '',
      resultLink: '',
      conclusion: '',
    },
  })

  const onSubmit = async (values: AddCdsAssessmentFormValues) => {
    try {
      await createAssessment(values)
      form.reset({
        date: defaultAssessmentDate(),
        assessor: '',
        resultLink: '',
        conclusion: '',
      })
    } catch {
      form.setError('root', {
        message: t('employeeProfile.s12.addAssessment.saveFailed'),
      })
    }
  }

  return {
    form,
    onSubmit,
    isCreatingAssessment,
  }
}

export const useCdsAssessmentConclusionEdit = (
  employeeId: string,
  entry: CdsAssessmentEntry,
) => {
  const { t } = useTranslation()
  const { updateAssessmentConclusion, isUpdatingAssessmentConclusion } =
    useCdsData(employeeId)
  const { schema } = useMemo(
    () => createEditCdsAssessmentConclusionFormSchema(t),
    [t],
  )
  const defaultValues = useMemo<EditCdsAssessmentConclusionFormValues>(
    () => ({
      conclusion: entry.conclusion,
    }),
    [entry.conclusion],
  )

  const form = useForm<EditCdsAssessmentConclusionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
    resetOptions: { keepDirtyValues: true },
  })

  const onSubmit = async (values: EditCdsAssessmentConclusionFormValues) => {
    try {
      await updateAssessmentConclusion(entry.id, values)
    } catch {
      form.setError('root', {
        message: t('employeeProfile.s12.editConclusion.saveFailed'),
      })
    }
  }

  return {
    form,
    onSubmit,
    isUpdatingAssessmentConclusion,
  }
}

export const useCompleteIdpRecord = (employeeId: string) => {
  const { completeIdpRecord, isCompletingIdpRecord } = useCdsData(employeeId)

  const handleComplete = async (idpId: string) => {
    try {
      await completeIdpRecord(idpId)
    } catch {
      // Mutation hook already surfaces a toast in onError.
    }
  }

  return {
    handleComplete,
    isCompletingIdpRecord,
  }
}
