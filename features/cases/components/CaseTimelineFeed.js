import { ConceptCard, ConceptLink } from '@/components/ui/ConceptLayout';

import { buildTimelineEntries, formatTimelineDate } from '../caseTimelineEntries';
import CaseEmailMessageCard from './CaseEmailMessageCard';

const TIMELINE_PATH = '/cases/detail/timeline';

function getEmailDirectionLabel(direction) {
  if (direction === 'OUTBOUND') return '이메일 발송';
  if (direction === 'INBOUND') return '이메일 수신';
  return '이메일';
}

export default function CaseTimelineFeed({
  caseId,
  caseDetail,
  page,
  messages,
  previousMessages,
  selectedMessage,
}) {
  const entries = buildTimelineEntries(caseDetail, messages.data, previousMessages?.data, page);
  const hasPreviousPage = Boolean(messages.data) && page > 0;
  const hasNextPage = messages.data && (page + 1) * messages.data.size < messages.data.total;

  function getTimelineHref({ targetPage = page, messageId } = {}) {
    const query = { id: caseId };
    if (targetPage > 0) query.page = targetPage;
    if (messageId !== undefined) query.messageId = messageId;
    return { pathname: TIMELINE_PATH, query };
  }

  return (
    <>
      <ConceptCard title="사건 기록">
        {messages.errorMessage && <p role="alert">{messages.errorMessage}</p>}
        {entries.length === 0 ? (
          <p className="text-sm text-gre-muted">이 페이지에 표시할 기록이 없어요.</p>
        ) : (
          <ol className="divide-y divide-gre-border text-sm">
            {entries.map(({ label, date, message }) => (
              <li
                key={message ? `email-${message.messageId}` : label}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="wrap-anywhere font-medium">
                    {message ? message.subject || '제목 없음' : label}
                  </p>
                  <p className="mt-1 text-gre-muted">
                    {message && `${getEmailDirectionLabel(message.direction)} · `}
                    <time dateTime={date ?? undefined}>{formatTimelineDate(date)}</time>
                  </p>
                </div>
                {message && (
                  <ConceptLink href={getTimelineHref({ messageId: message.messageId })}>
                    이메일 보기
                  </ConceptLink>
                )}
              </li>
            ))}
          </ol>
        )}
        {(hasPreviousPage || hasNextPage) && (
          <nav className="mt-4 flex gap-3" aria-label="사건 기록 페이지">
            {hasPreviousPage && (
              <ConceptLink href={getTimelineHref({ targetPage: page - 1 })}>이전</ConceptLink>
            )}
            {hasNextPage && (
              <ConceptLink href={getTimelineHref({ targetPage: page + 1 })}>다음</ConceptLink>
            )}
          </nav>
        )}
      </ConceptCard>
      {selectedMessage && (
        <CaseEmailMessageCard
          message={selectedMessage.data}
          errorMessage={selectedMessage.errorMessage}
          closeHref={getTimelineHref()}
        />
      )}
    </>
  );
}
