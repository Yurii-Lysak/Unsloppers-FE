import { Handshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { cn } from '@/lib/utils'
import { AssignMenteeDialog } from './components/AssignMenteeDialog/AssignMenteeDialog'
import { EndPairDialog } from './components/EndPairDialog/EndPairDialog'
import { useMentorshipHubPage } from './hooks/useMentorshipHubPage'
import type { MentorshipPairListFilter } from '@/types/mentorship'

const PAIR_STATUS_FILTERS: MentorshipPairListFilter[] = ['all', 'active', 'ended']

const formatPairDate = (value: string | null) => {
  if (!value) {
    return '—'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return '—'
  }

  return parsed.toLocaleDateString()
}

export const MentorshipHubPage = () => {
  const { t } = useTranslation()
  const {
    willingMentors,
    assignableMentees,
    pairs,
    pairStatusFilter,
    setPairStatusFilter,
    isMentorsLoading,
    isMenteesLoading,
    isPairsLoading,
    isMentorsError,
    isMenteesError,
    isPairsError,
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
  const hasPairs = pairs.length > 0
  const isMentorsSectionLoading = isMentorsLoading || isMenteesLoading
  const emptyPairsMessage =
    pairStatusFilter === 'all'
      ? t('mentorshipHub.emptyPairs')
      : t(`mentorshipHub.emptyPairsFiltered.${pairStatusFilter}`)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Handshake className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground" data-testid="mentorship-hub-title">
          {t('mentorshipHub.title')}
        </h1>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          {t('mentorshipHub.allPairsTitle')}
        </h2>

        <div className="flex flex-wrap gap-2" role="group" aria-label={t('mentorshipHub.statusFilterLabel')}>
          {PAIR_STATUS_FILTERS.map(filter => (
            <Button
              key={filter}
              type="button"
              variant={pairStatusFilter === filter ? 'default' : 'outline'}
              className={cn(
                pairStatusFilter === filter && 'ring-2 ring-primary/40',
              )}
              aria-pressed={pairStatusFilter === filter}
              onClick={() => setPairStatusFilter(filter)}
              data-testid={`mentorship-hub-status-filter-${filter}`}
            >
              {t(`mentorshipHub.statusFilter.${filter}`)}
            </Button>
          ))}
        </div>

        {isPairsLoading && (
          <p className="text-muted-foreground">{t('mentorshipHub.loadingPairs')}</p>
        )}

        {isPairsError && (
          <p className="text-destructive">{t('mentorshipHub.loadPairsFailed')}</p>
        )}

        {!isPairsLoading && !isPairsError && !hasPairs && (
          <p
            className="text-muted-foreground"
            data-testid="mentorship-hub-empty-pairs"
          >
            {emptyPairsMessage}
          </p>
        )}

        {!isPairsLoading && !isPairsError && hasPairs && (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left" data-testid="mentorship-hub-pairs-table">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-foreground">
                    {t('mentorshipHub.mentorColumn')}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-foreground">
                    {t('mentorshipHub.menteeColumn')}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-foreground">
                    {t('mentorshipHub.startDateColumn')}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-foreground">
                    {t('mentorshipHub.endDateColumn')}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-foreground">
                    {t('mentorshipHub.statusColumn')}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-foreground">
                    {t('mentorshipHub.actionsColumn')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pairs.map(pair => (
                  <tr key={pair.id} data-testid={`mentorship-hub-pair-row-${pair.id}`}>
                    <td className="px-4 py-3 text-foreground">
                      <Link
                        to={`/employees/${pair.mentorId}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {pair.mentorDisplayName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      <Link
                        to={`/employees/${pair.menteeId}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {pair.menteeDisplayName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPairDate(pair.startedAt)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPairDate(pair.endedAt)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {t(`mentorshipHub.pairStatus.${pair.status}`)}
                    </td>
                    <td className="px-4 py-3">
                      {pair.status === 'active' ? (
                        <Button
                          variant="outline"
                          onClick={() => openEndDialog(pair)}
                          data-testid={`mentorship-hub-end-${pair.id}`}
                        >
                          {t('mentorshipHub.endAction')}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">
                          {t('mentorshipHub.noAction')}
                        </span>
                      )}
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

        {isMentorsSectionLoading && (
          <p className="text-muted-foreground">{t('mentorshipHub.loadingMentors')}</p>
        )}

        {isMentorsError && (
          <p className="text-destructive">{t('mentorshipHub.loadMentorsFailed')}</p>
        )}

        {isMenteesError && (
          <p className="text-destructive">{t('mentorshipHub.loadMenteesFailed')}</p>
        )}

        {!isMentorsSectionLoading && !isMentorsError && !isMenteesError && !hasMentors && (
          <p className="text-muted-foreground" data-testid="mentorship-hub-empty-mentors">
            {t('mentorshipHub.emptyMentors')}
          </p>
        )}

        {!isMentorsSectionLoading && !isMentorsError && !isMenteesError && hasMentors && (
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
