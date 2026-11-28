import Link from 'next/link';

import { ConceptCard } from '@/components/ui/ConceptLayout';

export default function CaseEmailMessageCard({ message, errorMessage, closeHref }) {
  return (
    <ConceptCard className="mt-6">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">이메일 상세</h2>
        <Link href={closeHref} scroll={false} className="gre-button" aria-label="이메일 상세 닫기">
          <span aria-hidden="true">×</span>
        </Link>
      </header>
      {errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : (
        <>
          <h3 className="wrap-anywhere font-semibold">{message.subject || '제목 없음'}</h3>
          <dl className="mt-3 grid gap-2 text-sm">
            <div>
              <dt className="inline text-gre-muted">보낸 사람 </dt>
              <dd className="inline wrap-anywhere">{message.from ?? '—'}</dd>
            </div>
            <div>
              <dt className="inline text-gre-muted">받는 사람 </dt>
              <dd className="inline wrap-anywhere">{message.to ?? '—'}</dd>
            </div>
          </dl>
          <p className="mt-4 wrap-anywhere whitespace-pre-wrap border-t border-gre-border pt-4 text-sm">
            {message.body || '본문이 없습니다.'}
          </p>
        </>
      )}
    </ConceptCard>
  );
}
