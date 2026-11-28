import CaseDetail from '@/features/cases/CaseDetail';
import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import { getCase } from '@/features/cases/api/caseApi';
import { getCaseStatusLabel } from '@/features/cases/caseDisplay';
import { closePreviewCase, getPreviewCases } from '@/features/cases/casePreviewState';

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
        <ConceptCard title="사건 정보">
          <dl className="grid gap-4 text-sm @xl:grid-cols-3">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="mb-2 text-gre-muted">{label}</dt>
                <dd className="wrap-anywhere">{value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </ConceptCard>
      </ConceptPage>
    );
  }
  if (typeof id === 'string' && id.startsWith('preview-')) {
    return <CaseDetail caseId={id} />;
  }

  const cases = await getPreviewCases();
  const example = id === undefined ? cases[0] : cases.find((entry) => entry.id === id);

  if (!example) {
    return <CaseDetail />;
  }

  return <CaseDetail example={example} closeExample={closePreviewCase.bind(null, example.id)} />;
}
