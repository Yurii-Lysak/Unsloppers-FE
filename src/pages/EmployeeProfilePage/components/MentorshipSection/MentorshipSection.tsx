import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/Switch/Switch'
import type {
  AccessRole,
  MentorshipSection as MentorshipSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import { useMentorshipSection } from './hooks/useMentorshipSection'

interface MentorshipSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<MentorshipSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
  audienceRole: AccessRole
}

const mentorStatusLabelKey = (status: MentorshipSectionData['mentorStatus']) =>
  `employeeProfile.s13.status.${status}` as const

export const MentorshipSectionCard = ({
  employeeId,
  section,
  accessLevel,
  audienceRole,
}: MentorshipSectionCardProps) => {
  const { t } = useTranslation()
  const canEditFlag = audienceRole === 'Self' && accessLevel === 'RW'
  const { toggleOpenToMentoring, isPatchingOpenToMentoring } =
    useMentorshipSection(employeeId, accessLevel, canEditFlag)

  if (!isSectionData<MentorshipSectionData>(section)) {
    return null
  }

  const { openToMentoring, mentorStatus, mentor, mentees } = section.data

  return (
    <div className="space-y-4" data-testid="mentorship-section">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">
            {t('employeeProfile.s13.statusLabel')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(mentorStatusLabelKey(mentorStatus))}
          </p>
        </div>
        {canEditFlag && (
          <Switch
            checked={openToMentoring}
            disabled={isPatchingOpenToMentoring}
            label={t('employeeProfile.s13.openToMentoring')}
            onCheckedChange={checked => {
              void toggleOpenToMentoring(checked)
            }}
            data-testid="mentorship-open-to-mentoring"
          />
        )}
      </div>

      {mentor && (
        <div>
          <p className="text-sm font-medium text-foreground">
            {t('employeeProfile.s13.mentor')}
          </p>
          <p className="text-sm text-muted-foreground">
            <Link
              to={`/employees/${mentor.id}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {mentor.displayName}
            </Link>
          </p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-foreground">
          {t('employeeProfile.s13.mentees')}
        </p>
        {mentees.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('employeeProfile.s13.noMentees')}
          </p>
        ) : (
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {mentees.map((mentee) => (
              <li key={mentee.id}>
                <Link
                  to={`/employees/${mentee.id}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {mentee.displayName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
