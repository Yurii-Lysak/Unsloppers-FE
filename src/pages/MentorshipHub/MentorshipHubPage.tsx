import { Handshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { AssignMenteeDialog } from './components/AssignMenteeDialog/AssignMenteeDialog'
import { EndPairDialog } from './components/EndPairDialog/EndPairDialog'
import { useMentorshipHubPage } from './hooks/useMentorshipHubPage'

export const MentorshipHubPage = () => {
  const { t } = useTranslation()
  const {
    willingMentors,
    assignableMentees,
    activePairs,
    isMentorsLoading,
    isMenteesLoading,
    isActivePairsLoading,
    isMentorsError,
    isMenteesError,
    isActivePairsError,
    assignDialogOpen,
    selectedMentor,
    openAssignDialog,
    closeAssignDialog,
    endDialogOpen,
    selectedPair,
    openEndDialog,
    closeEndDialog,
  } = useMentorshipHubPage()

  const hasMentors = willingMentors.length > 0
  const hasActivePairs = activePairs.length > 0
  const isLoading = isMentorsLoading || isMenteesLoading || isActivePairsLoading
  const isError = isMentorsError || isMenteesError || isActivePairsError

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Handshake className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground" data-testid="mentorship-hub-title">
          {t('mentorshipHub.title')}
        </h1>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">{t('mentorshipHub.loadingMentors')}</p>
      )}

      {isError && (
        <p className="text-destructive">
          {isMentorsError
            ? t('mentorshipHub.loadMentorsFailed')
            : isMenteesError
              ? t('mentorshipHub.loadMenteesFailed')
              : t('mentorshipHub.loadActivePairsFailed')}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {t('mentorshipHub.activePairsTitle')}
            </h2>

            {!hasActivePairs && (
              <p
                className="text-muted-foreground"
                data-testid="mentorship-hub-empty-active-pairs"
              >
                {t('mentorshipHub.emptyActivePairs')}
              </p>
            )}

            {hasActivePairs && (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left" data-testid="mentorship-hub-active-pairs-table">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium text-foreground">
                        {t('mentorshipHub.mentorColumn')}
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-foreground">
                        {t('mentorshipHub.menteeColumn')}
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-foreground">
                        {t('mentorshipHub.actionsColumn')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activePairs.map(pair => (
                      <tr key={pair.id} data-testid={`mentorship-hub-active-row-${pair.id}`}>
                        <td className="px-4 py-3 text-foreground">{pair.mentorDisplayName}</td>
                        <td className="px-4 py-3 text-foreground">{pair.menteeDisplayName}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="outline"
                            onClick={() => openEndDialog(pair)}
                            data-testid={`mentorship-hub-end-${pair.id}`}
                          >
                            {t('mentorshipHub.endAction')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {t('mentorshipHub.willingMentorsTitle')}
            </h2>

            {!hasMentors && (
              <p className="text-muted-foreground" data-testid="mentorship-hub-empty-mentors">
                {t('mentorshipHub.emptyMentors')}
              </p>
            )}

            {hasMentors && (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left" data-testid="mentorship-hub-mentors-table">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium text-foreground">
                        {t('mentorshipHub.mentorColumn')}
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-foreground">
                        {t('mentorshipHub.actionsColumn')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {willingMentors.map(mentor => (
                      <tr key={mentor.id} data-testid={`mentorship-hub-row-${mentor.id}`}>
                        <td className="px-4 py-3 text-foreground">{mentor.displayName}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="outline"
                            onClick={() => openAssignDialog(mentor)}
                            data-testid={`mentorship-hub-assign-${mentor.id}`}
                          >
                            {t('mentorshipHub.assignAction')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      <AssignMenteeDialog
        open={assignDialogOpen}
        mentor={selectedMentor}
        mentees={assignableMentees}
        onClose={closeAssignDialog}
      />

      <EndPairDialog
        open={endDialogOpen}
        pair={selectedPair}
        onClose={closeEndDialog}
      />
    </div>
  )
}
