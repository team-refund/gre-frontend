import { formatTimelineDate, getCaseMilestones } from '../caseTimelineEntries';

export default function CaseMilestones({ createdAt, resolvedAt, compact = false }) {
  const milestones = getCaseMilestones({ createdAt, resolvedAt });

  if (milestones.length === 0) {
    return <p className="mb-4 text-sm text-gre-muted">표시할 사건 기록이 없어요.</p>;
  }

  return (
    <ol className={compact ? 'mb-4 space-y-3 text-sm' : 'divide-y divide-gre-border text-sm'}>
      {milestones.map(({ label, date }) => (
        <li key={label} className={compact ? undefined : 'py-4'}>
          <time dateTime={date} className="text-gre-muted">
            {formatTimelineDate(date)}
          </time>
          {' · '}{label}
        </li>
      ))}
    </ol>
  );
}
