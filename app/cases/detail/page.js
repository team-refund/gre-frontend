import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import { getCase } from '@/features/cases/api/caseApi';
import { getCaseStatusLabel } from '@/features/cases/caseDisplay';
import CaseDetailActivity from '@/features/cases/components/CaseDetailActivity';
import CaseMilestones from '@/features/cases/components/CaseMilestones';

export default async function CaseDetailPage({ searchParams }) {
  const { id } = await searchParams;
  if (typeof id === 'string' && /^[1-9]\d{0,18}$/.test(id)) {
    const { data, errorMessage } = await getCase(id);
    const action = <ConceptLink href="/cases">← 내 사건</ConceptLink>;
    if (!data) {
      return (
        <ConceptPage title="사건 상세" action={action}>
          <p role="alert">{errorMessage}</p>
        </ConceptPage>
      );
    }
    const fields = [
      ['업무 상태', getCaseStatusLabel(data.status)],
      ['판매자', data.merchantName],
      ['판매자 이메일', data.merchantEmail],
      ['구매 사이트', data.purchaseSite],
      ['주문번호', data.orderNumber],
      ['구매일', data.purchaseDate],
      ['결제 금액', data.paymentAmount],
    ];
    return (
      <ConceptPage title={data.title} description={`사건 #${id}`} action={action}>
        <ConceptCard title="사건 정보" className="mb-6">
          <dl className="grid gap-4 text-sm @xl:grid-cols-3">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="mb-2 text-gre-muted">{label}</dt>
                <dd className="wrap-anywhere">{value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </ConceptCard>
        <CaseDetailActivity
          caseId={id}
          status={data.status}
          requirement={data.requirement}
          latestRun={data.latestRun}
          emailDrafts={data.emailDrafts}
        />
        <div className="grid gap-6 @3xl:grid-cols-2">
          <ConceptCard title="사건 타임라인">
            <CaseMilestones createdAt={data.createdAt} resolvedAt={data.resolvedAt} compact />
            <ConceptLink href={{ pathname: '/cases/detail/timeline', query: { id } }}>
              자세히 보기 →
            </ConceptLink>
          </ConceptCard>
          <ConceptCard title="증빙 및 정책 근거">
            <p className="mb-4 text-sm text-gre-muted">거래 증빙 자료와 분석 상태를 확인하세요.</p>
            <ConceptLink href={{ pathname: '/cases/detail/evidence', query: { id } }}>
              증빙·정책 근거 확인
            </ConceptLink>
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
