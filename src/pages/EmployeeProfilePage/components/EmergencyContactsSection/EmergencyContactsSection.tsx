import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Input } from '@/components/Input/Input'
import type {
  EmergencyContact,
  EmergencyContactsSection as EmergencyContactsSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import {
  useAddEmergencyContactForm,
  useEmergencyContactItem,
} from './hooks/useEmergencyContactsSection'

interface EmergencyContactsSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<EmergencyContactsSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
}

export const EmergencyContactsSectionCard = ({
  employeeId,
  section,
  accessLevel,
}: EmergencyContactsSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<EmergencyContactsSectionData>(section)) {
    return null
  }

  const { contacts } = section.data
  const canWrite = accessLevel === 'RW'

  return (
    <div className="space-y-4" data-testid="emergency-contacts-section">
      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.s3.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {contacts.map((contact) => (
            <EmergencyContactItem
              key={contact.id}
              employeeId={employeeId}
              contact={contact}
              canWrite={canWrite}
            />
          ))}
        </ul>
      )}

      {canWrite && <AddEmergencyContactForm employeeId={employeeId} />}
    </div>
  )
}

const EmergencyContactItem = ({
  employeeId,
  contact,
  canWrite,
}: {
  employeeId: string
  contact: EmergencyContact
  canWrite: boolean
}) => {
  const { t } = useTranslation()
  const { form, onSubmit, isMutating, handleDelete } = useEmergencyContactItem(
    employeeId,
    contact,
  )

  if (!canWrite) {
    return (
      <li
        className="rounded-md border border-border p-3 text-sm"
        data-testid={`emergency-contact-${contact.id}`}
      >
        <p className="font-medium text-foreground">{contact.contactPerson}</p>
        <p className="text-muted-foreground">
          {contact.relationship} · {contact.phone}
        </p>
      </li>
    )
  }

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`emergency-contact-${contact.id}`}
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-2">
        <Input
          name="contactPerson"
          label={t('employeeProfile.s3.fields.contactPerson')}
        />
        <Input
          name="relationship"
          label={t('employeeProfile.s3.fields.relationship')}
        />
        <Input name="phone" label={t('employeeProfile.s3.fields.phone')} />
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
            {t('employeeProfile.s3.deleteButton')}
          </Button>
        </div>
      </Form>
    </li>
  )
}

const AddEmergencyContactForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isMutating } = useAddEmergencyContactForm(employeeId)

  return (
    <div className="border-t border-border pt-4">
      <Form form={form} onSubmit={onSubmit} className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">
          {t('employeeProfile.s3.addHeading')}
        </h4>
        <Input
          name="contactPerson"
          label={t('employeeProfile.s3.fields.contactPerson')}
        />
        <Input
          name="relationship"
          label={t('employeeProfile.s3.fields.relationship')}
        />
        <Input name="phone" label={t('employeeProfile.s3.fields.phone')} />
        <FormRootError />
        <Button type="submit" disabled={isMutating} data-testid="add-emergency-contact">
          {t('employeeProfile.s3.addSubmit')}
        </Button>
      </Form>
    </div>
  )
}
