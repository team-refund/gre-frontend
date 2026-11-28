const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
});

export function timelineTimestamp(date) {
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp) ? timestamp : -Infinity;
}

export function formatTimelineDate(date) {
  const timestamp = timelineTimestamp(date);
  return Number.isFinite(timestamp) ? DATE_FORMATTER.format(timestamp) : '—';
}

export function getCaseMilestones({ createdAt, resolvedAt }) {
  return [
    { label: '사건 해결', date: resolvedAt },
    { label: '사건 등록', date: createdAt },
  ].filter(({ date }) => Number.isFinite(timelineTimestamp(date)));
}

export function buildTimelineEntries(caseDetail, messages, previousMessages, page) {
  const items = messages?.items ?? [];
  const hasNext = messages && (page + 1) * messages.size < messages.total;
  const lowerBound = hasNext ? timelineTimestamp(items.at(-1)?.sentOrReceivedAt) : -Infinity;
  const upperBound = page === 0
    ? Infinity
    : timelineTimestamp(previousMessages?.items.at(-1)?.sentOrReceivedAt);

  const milestones = getCaseMilestones(caseDetail).filter(({ date }) => {
    const timestamp = timelineTimestamp(date);
    return timestamp >= lowerBound && timestamp < upperBound;
  });
  const emails = items.map((message) => ({ date: message.sentOrReceivedAt, message }));
  return [...emails, ...milestones].sort((left, right) => {
    const a = timelineTimestamp(left.date);
    const b = timelineTimestamp(right.date);
    if (a === b) return 0;
    return a > b ? -1 : 1;
  });
}
