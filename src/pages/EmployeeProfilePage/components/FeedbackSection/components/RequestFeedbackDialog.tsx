import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { Input } from '@/components/Input/Input'
import { Modal } from '@/components/Modal/Modal'
import { Textarea } from '@/components/Textarea/Textarea'
import { useEmployeesListData } from '@/hooks/data/useEmployeesData'
import { BUILTIN_FIELD_IDS } from '@/types/employees'
import { useRequestFeedbackFlow } from '../hooks/useRequestFeedbackFlow'
import {
  buildRequestFeedbackDefaultValues,
  createRequestFeedbackFormSchema,
  type RequestFeedbackFormValues,
} from '../schemas/request-feedback.schema'

const EMPLOYEE_LIST_PAGE = 1
const EMPLOYEE_LIST_PAGE_SIZE = 100

interface RequestFeedbackDialogProps {
  open: boolean
  onClose: () => void
  subjectEmployeeId: string
  subjectDisplayName: string
}

export const RequestFeedbackDialog = ({
  open,
  onClose,
  subjectEmployeeId,
  subjectDisplayName,
}: RequestFeedbackDialogProps) => {
  const { t } = useTranslation()
  const { submitRequestFeedback, isSubmitting } = useRequestFeedbackFlow()
  const { employeesList, isEmployeesLoading, isEmployeesError } = useEmployeesListData({
    page: EMPLOYEE_LIST_PAGE,
    pageSize: EMPLOYEE_LIST_PAGE_SIZE,
  })

  const { schema } = useMemo(() => createRequestFeedbackFormSchema(t), [t])

  const defaultValues = useMemo(
    () => buildRequestFeedbackDefaultValues(t, subjectDisplayName),
    [subjectDisplayName, t],
  )

  const form = useForm<RequestFeedbackFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(buildRequestFeedbackDefaultValues(t, subjectDisplayName))
    }
  }, [form, open, subjectDisplayName, t])

  const colleagueOptions = useMemo(() => {
    if (!employeesList) {
      return []
    }

    return employeesList.rows
      .filter(row => row.employeeId !== subjectEmployeeId)
      .map(row => ({
        value: row.employeeId,
        label: String(row.cells[BUILTIN_FIELD_IDS.name] ?? row.employeeId),
      }))
  }, [employeesList, subjectEmployeeId])

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const onSubmit = async (values: RequestFeedbackFormValues) => {
    const succeeded = await submitRequestFeedback(values)
    if (succeeded) {
      onClose()
    }
  }

  const colleagueError = form.formState.errors.colleagueIds?.message
  const isSubmitDisabled =
    isSubmitting || isEmployeesLoading || isEmployeesError || colleagueOptions.length === 0

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('employeeProfile.s8.requestFeedback.title')}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('employeeProfile.s8.requestFeedback.cancel')}
          </Button>
          <Button
            type="submit"
            form="request-feedback-form"
            disabled={isSubmitDisabled}
            data-testid="request-feedback-submit"
          >
            {isSubmitting
              ? t('employeeProfile.s8.requestFeedback.submitting')
              : t('employeeProfile.s8.requestFeedback.submit')}
          </Button>
        </>
      }
    >
      <Form
        id="request-feedback-form"
        form={form}
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <Input
          name="title"
          label={t('campaigns.form.title')}
          data-testid="request-feedback-title"
        />
        <Textarea
          name="description"
          label={t('campaigns.form.description')}
          className="min-h-16"
          data-testid="request-feedback-description"
        />
        <Textarea
          name="purpose"
          label={t('campaigns.form.purpose')}
          className="min-h-24"
          data-testid="request-feedback-purpose"
        />
        <Input
          name="link"
          label={t('campaigns.form.link')}
          placeholder={t('campaigns.form.linkPlaceholder')}
          data-testid="request-feedback-link"
        />
        <Input
          name="dueDate"
          type="date"
          label={t('campaigns.form.dueDate')}
          data-testid="request-feedback-due-date"
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {t('employeeProfile.s8.requestFeedback.colleaguesLabel')}
          </p>
          {isEmployeesLoading && (
            <p className="text-sm text-muted-foreground" data-testid="request-feedback-colleagues-loading">
              {t('employeeProfile.s8.requestFeedback.colleaguesLoading')}
            </p>
          )}
          {isEmployeesError && (
            <p
              className="text-sm text-destructive"
              role="alert"
              data-testid="request-feedback-colleagues-error"
            >
              {t('employeeProfile.s8.requestFeedback.colleaguesLoadFailed')}
            </p>
          )}
          {!isEmployeesLoading && !isEmployeesError && colleagueOptions.length === 0 && (
            <p className="text-sm text-muted-foreground" data-testid="request-feedback-colleagues-empty">
              {t('employeeProfile.s8.requestFeedback.colleaguesEmpty')}
            </p>
          )}
          {!isEmployeesLoading && !isEmployeesError && colleagueOptions.length > 0 && (
            <Controller
              name="colleagueIds"
              control={form.control}
              render={({ field }) => (
                <ul
                  className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-border p-3"
                  data-testid="request-feedback-colleague-list"
                >
                  {colleagueOptions.map(option => {
                    const checked = field.value.includes(option.value)
                    return (
                      <li key={option.value}>
                        <Checkbox
                          checked={checked}
                          label={option.label}
                          onCheckedChange={nextChecked => {
                            const next = nextChecked
                              ? [...field.value, option.value]
                              : field.value.filter(id => id !== option.value)
                            field.onChange([...new Set(next)])
                          }}
                          data-testid={`request-feedback-colleague-${option.value}`}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            />
          )}
          {colleagueError && (
            <p className="text-sm text-destructive" role="alert">
              {colleagueError}
            </p>
          )}
        </div>
      </Form>
    </Modal>
  )
}
