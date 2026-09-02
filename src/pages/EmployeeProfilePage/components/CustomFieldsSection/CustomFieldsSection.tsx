import { useTranslation } from 'react-i18next'
import type {
  CustomFieldSpec,
  CustomFieldsSection as CustomFieldsSectionData,
  CustomFieldValue,
  ProfileSectionEnvelope,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'

interface CustomFieldsSectionCardProps {
  section: ProfileSectionEnvelope<CustomFieldsSectionData>
}

/**
 * S16 — read-only per-field render. No inline-edit affordance: field values
 * are edited through the field-administration surface, not the profile.
 */
export const CustomFieldsSectionCard = ({
  section,
}: CustomFieldsSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<CustomFieldsSectionData>(section)) {
    return null
  }

  const { fields, values } = section.data

  if (fields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('employeeProfile.customFields.empty')}
      </p>
    )
  }

  return (
    <dl className="grid gap-3 text-sm" data-testid="custom-fields-section">
      {fields.map((field) => (
        <div key={field.id} data-testid={`custom-field-${field.id}`}>
          <dt className="text-muted-foreground">{field.name}</dt>
          <dd data-testid={`custom-field-${field.id}-value`}>
            {formatCustomFieldValue(field, values[field.id], t)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

const formatCustomFieldValue = (
  field: CustomFieldSpec,
  value: CustomFieldValue | undefined,
  t: (key: string) => string,
): string => {
  // A field key absent from `values` entirely means never-set (AD-6 lazy
  // unset) — distinct from a multi_select stored as an empty array below.
  if (value === undefined || value === null) {
    return t('employeeProfile.customFields.notSet')
  }

  if (field.type === 'multi_select') {
    const options = Array.isArray(value) ? value : []
    return options.length === 0
      ? t('employeeProfile.customFields.noneSelected')
      : options.join(', ')
  }

  if (field.type === 'boolean') {
    return value ? t('directory.boolean.true') : t('directory.boolean.false')
  }

  return String(value)
}
