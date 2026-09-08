import { Handshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { AssignMenteeDialog } from './components/AssignMenteeDialog/AssignMenteeDialog'
import { useMentorshipHubPage } from './hooks/useMentorshipHubPage'

export const MentorshipHubPage = () => {
  const { t } = useTranslation()
  const {
    willingMentors,
    assignableMentees,
    isMentorsLoading,
    isMenteesLoading,
    isMentorsError,
    isMenteesError,
    dialogOpen,
    selectedMentor,
    openAssignDialog,
    closeAssignDialog,
  } = useMentorshipHubPage()

  const hasMentors = willingMentors.length > 0
  const isLoading = isMentorsLoading || isMenteesLoading
  const isError = isMentorsError || isMenteesError

  return (
    <div className="space-y-6">
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
            : t('mentorshipHub.loadMenteesFailed')}
        </p>
      )}

      {!isLoading && !isError && !hasMentors && (
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

      <AssignMenteeDialog
        open={dialogOpen}
        mentor={selectedMentor}
        mentees={assignableMentees}
        onClose={closeAssignDialog}
      />
    </div>
  )
}
