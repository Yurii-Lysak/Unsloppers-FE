import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type {
  EmployeeProfile,
  IdentitySection,
  ProfileSectionData,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'

interface ProfileHeaderProps {
  profile: EmployeeProfile
}

const isIdentityData = (
  section: EmployeeProfile['sections']['S1'],
): section is ProfileSectionData<IdentitySection> =>
  Boolean(section && isSectionData<IdentitySection>(section))

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { t } = useTranslation()
  const s1 = profile.sections.S1

  if (!isIdentityData(s1)) {
    return null
  }

  const segments = [
    s1.data.manager
      ? {
          key: 'manager',
          label: t('employeeProfile.header.manager'),
          relation: s1.data.manager,
        }
      : null,
    s1.data.peoplePartner
      ? {
          key: 'peoplePartner',
          label: t('employeeProfile.header.peoplePartner'),
          relation: s1.data.peoplePartner,
        }
      : null,
    s1.data.mentor
      ? {
          key: 'mentor',
          label: t('employeeProfile.header.mentor'),
          relation: s1.data.mentor,
        }
      : null,
  ].filter((segment): segment is NonNullable<typeof segment> => segment !== null)

  if (segments.length === 0) {
    return null
  }

  return (
    <p
      className="mt-1 text-sm text-muted-foreground"
      data-testid="profile-header-relationships"
    >
      {segments.map((segment, index) => (
        <span key={segment.key}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          <span>
            {segment.label}:{' '}
            <Link
              to={`/employees/${segment.relation.id}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {segment.relation.displayName}
            </Link>
          </span>
        </span>
      ))}
    </p>
  )
}
