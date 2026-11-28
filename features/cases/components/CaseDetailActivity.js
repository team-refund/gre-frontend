import { ConceptBadge, ConceptCard, ConceptLink } from '@/components/ui/ConceptLayout';
import ChatComposer from '@/components/ui/ChatComposer';

import CaseRequirementCard from './CaseRequirementCard';

const RUN_STATUS = {
  PENDING: '대기 중',
  PROCESSING: '처리 중',
  COMPLETED: '완료',
  FAILED: '실패',
};

const DRAFT_STATUS = {
  DRAFT: '초안',
  FINALIZED: '확정',
};

function draftHref(draftId) {
  return {
    pathname: '/cases/detail/email-draft',
    query: { draftId: String(draftId) },
  };
}

export default function CaseDetailActivity({
  caseId,
  status,
  requirement,
  latestRun,
  emailDrafts = [],
}) {
  return (
    <>
      <ConceptCard title="이메일 초안 목록" className="mb-6">
        {emailDrafts.length > 0 ? (
          <ul className="divide-y divide-gre-border">
            {emailDrafts.map((draft) => (
              <li key={draft.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="mb-1 wrap-anywhere text-sm font-semibold">
                    {draft.subject || '제목 없는 초안'}
                  </p>
                  <ConceptBadge>
                    {Object.hasOwn(DRAFT_STATUS, draft.status)
                      ? DRAFT_STATUS[draft.status]
                      : '상태 확인 필요'}
                  </ConceptBadge>
                </div>
                <ConceptLink href={draftHref(draft.id)}>초안 보기 →</ConceptLink>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gre-muted">아직 생성된 이메일 초안이 없어요.</p>
        )}
      </ConceptCard>
      <ConceptCard className="mb-6">
        <header className="mb-3 border-b border-gre-border pb-3">
          <h2 className="text-lg font-bold">사용자 요구사항</h2>
        </header>
        <CaseRequirementCard
          key={caseId}
          caseId={caseId}
          requirement={requirement}
          canEdit={status !== 'RESOLVED' && status !== 'CLOSED'}
        />
        <section aria-live="polite" className="mt-6 space-y-2 border-t border-gre-border pt-4 text-sm leading-6">
          <h3 className="text-lg font-bold">{latestRun ? `AI Run ${latestRun.id}` : '지휘자 실행 상태'}</h3>
          {latestRun ? (
            <>
              <ConceptBadge tone={latestRun.status === 'COMPLETED' ? 'success' : 'neutral'}>
                {Object.hasOwn(RUN_STATUS, latestRun.status)
                  ? RUN_STATUS[latestRun.status]
                  : '상태 확인 필요'}
              </ConceptBadge>
              {latestRun.status === 'FAILED' && <p>최근 지휘자 실행에 실패했어요.</p>}
            </>
          ) : (
            <p className="text-gre-muted">아직 지휘자 실행 기록이 없어요.</p>
          )}
        </section>
        {status === 'NEED_USER_INFO' && (
          <section className="mt-5 border-t border-gre-border pt-4">
            <h3 className="mb-2 font-bold">지휘자 · 추가 정보 요청</h3>
            <p className="mb-3 text-sm text-gre-muted">
              추가 질문 조회와 답변 제출은 아직 준비 중이에요.
            </p>
            <ChatComposer
              inputLabel="지휘자에게 답변"
              placeholder="요청받은 추가 정보를 입력하세요."
              actionLabel="답변 보내기"
              inputDisabled
              disabled
            />
          </section>
        )}
      </ConceptCard>
    </>
  );
}
