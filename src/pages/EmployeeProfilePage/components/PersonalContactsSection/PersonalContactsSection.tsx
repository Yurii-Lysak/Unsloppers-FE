import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Input } from '@/components/Input/Input'
import { Select } from '@/components/Select/Select'
import type {
  PersonalContactMethod,
  PersonalContactsSection as PersonalContactsSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import {
  useAddContactMethodForm,
  useAddressFields,
  useContactMethodItem,
} from './hooks/usePersonalContactsSection'

interface PersonalContactsSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<PersonalContactsSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
}

const ADDRESS_FIELDS = [
  {
    key: 'residentialAddress' as const,
    labelKey: 'employeeProfile.sections.personalContacts.fields.residentialAddress',
  },
  {
    key: 'placeOfStay' as const,
    labelKey: 'employeeProfile.sections.personalContacts.fields.placeOfStay',
  },
]

export const PersonalContactsSectionCard = ({
  employeeId,
  section,
  accessLevel,
}: PersonalContactsSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<PersonalContactsSectionData>(section)) {
    return null
  }

  const { contactMethods, residentialAddress, placeOfStay } = section.data
  const canWrite = accessLevel === 'RW'

  return (
    <div className="space-y-6" data-testid="personal-contacts-section">
      <AddressBlock
        employeeId={employeeId}
        residentialAddress={residentialAddress}
        placeOfStay={placeOfStay}
        canWrite={canWrite}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          {t('employeeProfile.s2.contactMethodsHeading')}
        </h3>

        {contactMethods.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('employeeProfile.s2.empty')}
          </p>
        ) : (
          <ul className="space-y-3">
            {contactMethods.map((method) => (
              <ContactMethodItem
                key={method.id}
                employeeId={employeeId}
                method={method}
                canWrite={canWrite}
              />
            ))}
          </ul>
        )}

        {canWrite && <AddContactMethodForm employeeId={employeeId} />}
      </div>
    </div>
  )
}

const AddressBlock = ({
  employeeId,
  residentialAddress,
  placeOfStay,
  canWrite,
}: {
  employeeId: string
  residentialAddress: string | null
  placeOfStay: string | null
  canWrite: boolean
}) => {
  const { t } = useTranslation()
  const { form, onSubmit, isMutating } = useAddressFields(
    employeeId,
    residentialAddress,
    placeOfStay,
    canWrite,
  )
  const notSetLabel = t('employeeProfile.sections.personalContacts.notSet')

  if (!canWrite) {
    return (
      <dl className="space-y-2 text-sm">
        {ADDRESS_FIELDS.map(({ key, labelKey }) => {
          const value = key === 'residentialAddress' ? residentialAddress : placeOfStay
          const displayValue =
            value === null || value.trim() === '' ? notSetLabel : value

          return (
            <div
              key={key}
              className="grid gap-1 sm:grid-cols-[minmax(0,12rem)_1fr]"
            >
              <dt className="font-medium text-foreground">{t(labelKey)}</dt>
              <dd
                className="text-muted-foreground"
                data-testid={`personal-contacts-field-${key}`}
              >
                {displayValue}
              </dd>
            </div>
          )
        })}
      </dl>
    )
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s2.addressHeading')}
      </h3>
      <dl className="space-y-3 text-sm">
        {ADDRESS_FIELDS.map(({ key, labelKey }) => (
          <div
            key={key}
            className="grid gap-2 sm:grid-cols-[minmax(0,12rem)_1fr]"
          >
            <dt className="pt-2 font-medium text-foreground">{t(labelKey)}</dt>
            <dd>
              <Input name={key} data-testid={`personal-contacts-input-${key}`} />
            </dd>
          </div>
        ))}
      </dl>
      <FormRootError />
      <Button type="submit" disabled={isMutating} data-testid="personal-contacts-save-address">
        {t('employeeProfile.save')}
      </Button>
    </Form>
  )
}

const ContactMethodItem = ({
  employeeId,
  method,
  canWrite,
}: {
  employeeId: string
  method: PersonalContactMethod
  canWrite: boolean
}) => {
  const { t } = useTranslation()
  const { form, onSubmit, isMutating, handleDelete, typeOptions } =
    useContactMethodItem(employeeId, method)

  if (!canWrite) {
    return (
      <li
        className="rounded-md border border-border p-3 text-sm"
        data-testid={`contact-method-${method.id}`}
      >
        <p className="font-medium text-foreground">
          {method.label} ({t(`employeeProfile.s2.types.${method.type.toLowerCase()}`)})
        </p>
        <p className="text-muted-foreground">{method.value}</p>
      </li>
    )
  }

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`contact-method-${method.id}`}
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-2">
        <Select
          name="type"
          label={t('employeeProfile.s2.fields.type')}
          options={typeOptions}
        />
        <Input name="label" label={t('employeeProfile.s2.fields.label')} />
        <Input name="value" label={t('employeeProfile.s2.fields.value')} />
        <FormRootError />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isMutating}>
            {t('employeeProfile.save')}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isMutating}
            onClick={() => {
              void handleDelete()
            }}
          >
            {t('employeeProfile.s2.deleteButton')}
          </Button>
        </div>
      </Form>
    </li>
  )
}

const AddContactMethodForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isMutating, typeOptions } =
    useAddContactMethodForm(employeeId)

  return (
    <div className="border-t border-border pt-4">
      <Form form={form} onSubmit={onSubmit} className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">
          {t('employeeProfile.s2.addHeading')}
        </h4>
        <Select
          name="type"
          label={t('employeeProfile.s2.fields.type')}
          options={typeOptions}
        />
        <Input name="label" label={t('employeeProfile.s2.fields.label')} />
        <Input name="value" label={t('employeeProfile.s2.fields.value')} />
        <FormRootError />
        <Button type="submit" disabled={isMutating} data-testid="add-contact-method">
          {t('employeeProfile.s2.addSubmit')}
        </Button>
      </Form>
    </div>
  )
}
