import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import { getCaseEvidences } from '@/features/cases/api/caseApi';
import CaseEvidenceList from '@/features/cases/components/CaseEvidenceList';

export default async function CaseEvidencePage({ searchParams }) {
  const { id } = await searchParams;
  const detailHref = typeof id === 'string'
    ? { pathname: '/cases/detail', query: { id } }
    : '/cases/detail';
  const isActualCase = typeof id === 'string' && /^[1-9]\d{0,18}$/.test(id);

  if (isActualCase) {
    const { data, errorMessage } = await getCaseEvidences(id);
    return (
      <ConceptPage
        title="증빙 및 정책 근거"
        description="거래 증빙과 분석 상태를 확인하세요."
        action={<ConceptLink href={detailHref}>← 사건 상세</ConceptLink>}
      >
        <div className="grid gap-6 @3xl:grid-cols-2">
          <ConceptCard title="증빙 자료">
            {errorMessage ? <p role="alert">{errorMessage}</p> : (
              <CaseEvidenceList evidences={data} />
            )}
          </ConceptCard>
          <ConceptCard title="정책 근거">
            <p className="text-sm text-gre-muted">정책 근거 조회는 아직 준비 중이에요.</p>
          </ConceptCard>
        </div>
      </ConceptPage>
    );
  }

  return (
    <ConceptPage title="사건을 찾을 수 없어요"
      action={<ConceptLink href="/cases">← 내 사건</ConceptLink>} />
  );
}
