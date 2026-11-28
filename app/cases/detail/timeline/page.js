import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import { getCase, getCaseEmailMessage, getCaseEmailMessages } from '@/features/cases/api/caseApi';
import CaseTimelineFeed from '@/features/cases/components/CaseTimelineFeed';

const RESOURCE_ID = /^[1-9]\d{0,18}$/;
const MAX_PAGE = 2_147_483_647;

export default async function CaseTimelinePage({ searchParams }) {
  const { id, messageId, page: pageParam } = await searchParams;
  const detailHref = id ? { pathname: '/cases/detail', query: { id } } : '/cases/detail';
  const backLink = <ConceptLink href={detailHref}>← 사건 상세</ConceptLink>;

  if (typeof id !== 'string' || !RESOURCE_ID.test(id)) {
    return (
      <ConceptPage title="사건을 찾을 수 없어요"
        action={<ConceptLink href="/cases">← 내 사건</ConceptLink>} />
    );
  }

  const requestedPage = Number(pageParam ?? 0);
  const page = Number.isInteger(requestedPage) && requestedPage >= 0 && requestedPage <= MAX_PAGE
    ? requestedPage
    : 0;
  const [caseResult, messages, selectedMessage, previousMessages] = await Promise.all([
    getCase(id),
    getCaseEmailMessages(id, page),
    typeof messageId === 'string' && RESOURCE_ID.test(messageId)
      ? getCaseEmailMessage(id, messageId)
      : null,
    page > 0 ? getCaseEmailMessages(id, page - 1) : null,
  ]);

  return (
    <ConceptPage title="사건 타임라인" description={caseResult.data?.title} action={backLink}>
      {caseResult.data ? (
        <CaseTimelineFeed
          caseId={id}
          caseDetail={caseResult.data}
          page={page}
          messages={messages}
          previousMessages={previousMessages}
          selectedMessage={selectedMessage}
        />
      ) : (
        <ConceptCard title="사건 기록"><p role="alert">{caseResult.errorMessage}</p></ConceptCard>
      )}
    </ConceptPage>
  );
}
