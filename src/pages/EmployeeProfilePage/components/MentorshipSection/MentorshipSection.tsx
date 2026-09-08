import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Switch } from '@/components/Switch/Switch'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import type {
  AccessRole,
  MentorshipSection as MentorshipSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import type { ActiveMentorshipPair } from '@/types/mentorship'
import { EndPairDialog } from '@/pages/MentorshipHub/components/EndPairDialog/EndPairDialog'
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
  const { canAssignEndMentorships } = usePermissionsData()
  const canEditFlag = audienceRole === 'Self' && accessLevel === 'RW'
  const canEndPairs = canAssignEndMentorships && audienceRole !== 'Self'
  const { toggleOpenToMentoring, isPatchingOpenToMentoring } =
    useMentorshipSection(employeeId, accessLevel, canEditFlag)

  const [endDialogOpen, setEndDialogOpen] = useState(false)
  const [selectedPair, setSelectedPair] = useState<ActiveMentorshipPair | null>(
    null,
  )

  if (!isSectionData<MentorshipSectionData>(section)) {
    return null
  }

  const { openToMentoring, mentorStatus, mentor, mentees, pairHistory } =
    section.data

  const openEndDialog = (pair: ActiveMentorshipPair) => {
    setSelectedPair(pair)
    setEndDialogOpen(true)
  }

  const closeEndDialog = () => {
    setEndDialogOpen(false)
    setSelectedPair(null)
  }

  const buildPairFromMentor = (): ActiveMentorshipPair | null => {
    if (!mentor?.pairId) {
      return null
    }

    return {
      id: mentor.pairId,
      mentorId: mentor.id,
      mentorDisplayName: mentor.displayName,
      menteeId: employeeId,
      menteeDisplayName: t('employeeProfile.s13.thisEmployee'),
      startedAt: '',
    }
  }

  const buildPairFromMentee = (
    mentee: MentorshipSectionData['mentees'][number],
  ): ActiveMentorshipPair | null => {
    if (!mentee.pairId) {
      return null
    }

    return {
      id: mentee.pairId,
      mentorId: employeeId,
      mentorDisplayName: t('employeeProfile.s13.thisEmployee'),
      menteeId: mentee.id,
      menteeDisplayName: mentee.displayName,
      startedAt: '',
    }
  }

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
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          {canEndPairs && mentor.pairId && (
            <Button
              variant="outline"
              onClick={() => {
                const pair = buildPairFromMentor()
                if (pair) {
                  openEndDialog(pair)
                }
              }}
              data-testid="mentorship-end-mentor-pair"
            >
              {t('employeeProfile.s13.endPair')}
            </Button>
          )}
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
          <ul className="mt-1 space-y-2 text-sm text-muted-foreground">
            {mentees.map((mentee) => (
              <li
                key={mentee.id}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <Link
                  to={`/employees/${mentee.id}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {mentee.displayName}
                </Link>
                {canEndPairs && mentee.pairId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const pair = buildPairFromMentee(mentee)
                      if (pair) {
                        openEndDialog(pair)
                      }
                    }}
                    data-testid={`mentorship-end-mentee-pair-${mentee.id}`}
                  >
                    {t('employeeProfile.s13.endPair')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {pairHistory.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            {t('employeeProfile.s13.pairHistory')}
          </p>
          <ul className="space-y-3">
            {pairHistory.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-border p-3"
                data-testid={`mentorship-history-${entry.id}`}
              >
                <p className="text-sm text-foreground">
                  {t(`employeeProfile.s13.historyRole.${entry.role}`)}:{' '}
                  <Link
                    to={`/employees/${entry.counterpart.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {entry.counterpart.displayName}
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('employeeProfile.s13.historyDates', {
                    start: new Date(entry.startedAt).toLocaleDateString(),
                    end: new Date(entry.endedAt).toLocaleDateString(),
                  })}
                </p>
                {entry.closureFeedback && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('employeeProfile.s13.closureFeedback')}: {entry.closureFeedback}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <EndPairDialog
        open={endDialogOpen}
        pair={selectedPair}
        onClose={closeEndDialog}
      />
    </div>
  )
}
