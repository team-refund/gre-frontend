'use client';

import { useSyncExternalStore } from 'react';
import {
  ConceptBadge, ConceptCard, ConceptLink, ConceptPage,
} from '@/components/ui/ConceptLayout';
import { CASE_EXAMPLES } from '@/features/cases/caseExamples';
import CaseRunRequirements from '@/features/cases/CaseRunRequirements';
import CaseTimeline from '@/features/cases/CaseTimeline';

import {
  closeRegisteredCase, getRegisteredCases, getServerRegisteredCases, subscribeToRegisteredCases,
} from './registeredCases';

export default function CaseDetail({ caseId, example, closeExample }) {
  const registeredCases = useSyncExternalStore(
    subscribeToRegisteredCases, getRegisteredCases, getServerRegisteredCases,
  );
  const item = example ?? registeredCases.find((entry) => entry.id === caseId);

  if (!item) {
    return (
      <ConceptPage title="사건을 찾을 수 없습니다"
        action={<ConceptLink href="/cases">← 내 사건</ConceptLink>} />
    );
  }

  const isClosed = item.group === 'closed';
  const isDraftReady = !isClosed && item.id === CASE_EXAMPLES[0].id;

  return (
    <ConceptPage title={item.name} description={`${item.id} · 화면 예시 데이터`}
      action={<ConceptLink href="/cases">← 내 사건</ConceptLink>}>
      <ConceptCard className="mb-6">
        <dl className="grid gap-4 text-sm @xl:grid-cols-3">
          <div><dt className="mb-2 text-gre-muted">사건 업무 상태</dt>
            <dd><ConceptBadge tone={item.tone}>{item.status}</ConceptBadge></dd></div>
          <div><dt className="mb-2 text-gre-muted">판매자</dt>
            <dd>{item.seller ?? '—'}</dd>
            {(item.merchantEmail || example) && (
              <dd className="mt-1 wrap-anywhere text-gre-muted">
                {item.merchantEmail ?? 'support@merchant.example'}
              </dd>
            )}
          </div>
          <div><dt className="mb-2 text-gre-muted">다음 행동</dt><dd>{item.next}</dd></div>
        </dl>
      </ConceptCard>
      {isDraftReady && (
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[15px]
          bg-gre-selection p-6">
          <div><h2 className="font-bold">영문 이메일 초안 v3를 검토해 주세요</h2>
            <p className="mt-2 text-sm text-gre-muted">수신자·제목·본문을 확인합니다.</p></div>
          <ConceptLink href="/cases/detail/email-draft" primary>초안 작성·수정 →</ConceptLink>
        </section>
      )}
      {!isClosed && (
        <ConceptCard className="mb-6">
          <header className="mb-3 border-b border-gre-border pb-3">
            <h2 className="text-lg font-bold">사용자 요구사항</h2>
          </header>
          <CaseRunRequirements key={item.id} item={item} isExample={Boolean(example)} />
        </ConceptCard>
      )}
      <div className={isClosed ? 'grid gap-6' : 'grid gap-6 @3xl:grid-cols-2'}>
        <ConceptCard title="사건 타임라인">
          <CaseTimeline compact={!isClosed} />
          {!isClosed && (
            <ConceptLink href={{ pathname: '/cases/detail/timeline', query: { id: item.id } }}>
              자세히 보기 →
            </ConceptLink>
          )}
        </ConceptCard>
        <ConceptCard title="증빙 및 정책 근거">
          <p className="mb-4 text-sm text-gre-muted">주문 확인서 · 결제 내역 · 판매자 환불 정책</p>
          <ConceptLink href={{ pathname: '/cases/detail/evidence', query: { id: item.id } }}>
            증빙·정책 근거 확인
          </ConceptLink>
        </ConceptCard>
      </div>
      {!isClosed && (
        <form action={example ? closeExample : () => closeRegisteredCase(item.id)} className="mt-6 flex justify-end">
          <button className="gre-button" type="submit">사건 종료</button>
        </form>
      )}
    </ConceptPage>
  );
}
