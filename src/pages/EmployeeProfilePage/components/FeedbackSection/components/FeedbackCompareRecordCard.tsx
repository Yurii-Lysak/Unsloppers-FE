import type { FeedbackRecordRead } from '@/types/employee-profile'

interface FeedbackCompareRecordCardProps {
  record: FeedbackRecordRead
}

export const FeedbackCompareRecordCard = ({
  record,
}: FeedbackCompareRecordCardProps) => (
  <article
    className="rounded-md border border-border p-3 text-sm"
    data-testid={`feedback-compare-record-${record.id}`}
  >
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>{record.author.displayName}</span>
      <span>{record.recordedAt}</span>
    </div>
    <p className="mt-1 font-medium text-foreground">{record.context}</p>
    <p className="mt-2 whitespace-pre-wrap">{record.body}</p>
  </article>
)
