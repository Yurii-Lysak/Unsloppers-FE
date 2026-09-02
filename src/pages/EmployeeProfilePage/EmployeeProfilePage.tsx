import { UserCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { EmployeeProfile, SectionId } from '@/types/employee-profile'
import { Button } from '@/components/Button/Button'
import { FunctionalRolesAssignmentForm } from './components/FunctionalRolesAssignmentForm/FunctionalRolesAssignmentForm'
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader'
import { SharedLinkManagerDialog } from './components/SharedLinkManagerDialog/SharedLinkManagerDialog'
import { useEmployeeProfilePage } from './hooks/useEmployeeProfilePage'
import { LINK_CREATOR_ROLES, LINK_MANAGE_ROLES } from './shared-link-sections'
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const {
    employeeId,
    employeeProfile,
    isProfileError,
    showAccessChip,
    showFunctionalRolesSection,
  } = useEmployeeProfilePage({ showAssignmentOnly })

  const canCreateSharedLink =
    employeeProfile !== undefined &&
    LINK_CREATOR_ROLES.has(employeeProfile.audience.role)

  const canManageSharedLinks =
    employeeProfile !== undefined &&
    LINK_MANAGE_ROLES.has(employeeProfile.audience.role)

  const canOpenShareDialog = canCreateSharedLink || canManageSharedLinks

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
          {employeeProfile && <ProfileHeader profile={employeeProfile} />}
          {showAccessChip && employeeProfile && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p
                className="text-sm text-muted-foreground"
                data-testid="employee-profile-access-chip"
              >
                {t('employeeProfile.viewingAs', {
                  role: t(`employeeProfile.roles.${employeeProfile.audience.role}`),
                })}
              </p>
              {canOpenShareDialog && (
                <Button
                  type="button"
                  variant="outline"
                  data-testid="employee-profile-share-button"
                  onClick={() => setShareDialogOpen(true)}
                >
                  {t('employeeProfile.sharedLink.shareAction')}
                </Button>
              )}
            </div>
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

      {canOpenShareDialog && (
        <SharedLinkManagerDialog
          employeeId={employeeId}
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          canCreate={canCreateSharedLink}
          canManage={canManageSharedLinks}
        />
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
