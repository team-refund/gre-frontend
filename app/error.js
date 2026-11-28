'use client';

import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';

export default function RouteError({ retry }) {
  return (
    <ConceptPage title="화면을 불러오지 못했어요">
      <ConceptCard>
        <p role="alert" className="mb-4 text-sm text-gre-muted">
          다시 시도하거나 홈으로 이동해 주세요.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="gre-button gre-button-primary" onClick={() => retry()}>
            다시 시도
          </button>
          <ConceptLink href="/">홈으로 이동</ConceptLink>
        </div>
      </ConceptCard>
    </ConceptPage>
  );
}
