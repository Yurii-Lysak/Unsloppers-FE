import { UserCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { EmployeeProfile, SectionId } from '@/types/employee-profile'
import { FunctionalRolesAssignmentForm } from './components/FunctionalRolesAssignmentForm/FunctionalRolesAssignmentForm'
import { useEmployeeProfilePage } from './hooks/useEmployeeProfilePage'
import {
  orderedProfileSectionIds,
  PROFILE_SECTION_RENDERERS,
  PROFILE_SECTION_TITLE_KEYS,
} from './profile-sections'

interface EmployeeProfilePageProps {
  showAssignmentOnly?: boolean
}

export const EmployeeProfilePage = ({
  showAssignmentOnly = false,
}: EmployeeProfilePageProps) => {
  const { t } = useTranslation()
  const {
    employeeId,
    employeeProfile,
    isProfileError,
    showAccessChip,
    showFunctionalRolesSection,
  } = useEmployeeProfilePage({ showAssignmentOnly })

  if (!employeeId) {
    return (
      <div className="space-y-4">
        <p className="text-destructive" role="alert">
          {t('employeeProfile.invalidId')}
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/employees">{t('employeeProfile.backToList')}</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <UserCircle className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            <Link to="/employees">{t('employeeProfile.backToList')}</Link>
          </p>
          <h1
            className="text-3xl font-bold text-foreground"
            data-testid="employee-profile-title"
          >
            {employeeProfile?.displayName ?? t('employeeProfile.loading')}
          </h1>
          {showAccessChip && employeeProfile && (
            <p
              className="mt-2 text-sm text-muted-foreground"
              data-testid="employee-profile-access-chip"
            >
              {t('employeeProfile.viewingAs', {
                role: t(`employeeProfile.roles.${employeeProfile.audience.role}`),
              })}
            </p>
          )}
        </div>
      </div>

      {isProfileError && (
        <p className="text-destructive">{t('employeeProfile.loadFailed')}</p>
      )}

      {employeeProfile && !showAssignmentOnly && (
        <ProfileSections profile={employeeProfile} employeeId={employeeId} />
      )}

      {showFunctionalRolesSection && (
        <section
          className="rounded-lg border border-border p-4"
          data-testid="employment-section"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {t('employeeProfile.employmentSection')}
          </h2>
          <FunctionalRolesAssignmentForm employeeId={employeeId} />
        </section>
      )}
    </div>
  )
}

const ProfileSections = ({
  profile,
  employeeId,
}: {
  profile: EmployeeProfile
  employeeId: string
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4" data-testid="employee-profile-sections">
      {orderedProfileSectionIds(profile.sections).map((sectionId) => (
        <ProfileSectionCard
          key={sectionId}
          employeeId={employeeId}
          sectionId={sectionId}
          section={profile.sections[sectionId]!}
          title={sectionTitle(t, sectionId)}
          unavailableLabel={t('employeeProfile.unavailableSection')}
        />
      ))}
    </div>
  )
}

const sectionTitle = (
  t: (key: string, options?: { id: string }) => string,
  sectionId: SectionId,
): string => {
  const titleKey = PROFILE_SECTION_TITLE_KEYS[sectionId]
  if (titleKey) {
    return t(titleKey)
  }
  return t('employeeProfile.sections.generic', { id: sectionId })
}

const ProfileSectionCard = ({
  employeeId,
  sectionId,
  section,
  title,
  unavailableLabel,
}: {
  employeeId: string
  sectionId: SectionId
  section: NonNullable<EmployeeProfile['sections'][SectionId]>
  title: string
  unavailableLabel: string
}) => {
  const { t } = useTranslation()
  const renderer = PROFILE_SECTION_RENDERERS[sectionId]

  return (
    <section
      className="rounded-lg border border-border p-4"
      data-testid={`profile-section-${sectionId.toLowerCase()}`}
    >
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      {'status' in section && section.status === 'unavailable' ? (
        <p className="text-sm text-muted-foreground">{unavailableLabel}</p>
      ) : renderer ? (
        renderer({
          employeeId,
          section,
          accessLevel: section.accessLevel,
          t,
        })
      ) : (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.emptySection')}
        </p>
      )}
    </section>
  )
}
