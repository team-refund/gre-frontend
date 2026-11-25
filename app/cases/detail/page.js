import {
  ConceptBadge, ConceptCard, ConceptLink, ConceptPage,
} from '@/components/ui/ConceptLayout';
import { CASE_EXAMPLES } from '@/features/cases/caseExamples';

export default async function CaseDetailPage({ searchParams }) {
  const { id } = await searchParams;
  const item = CASE_EXAMPLES.find((entry) => entry.id === id) ?? CASE_EXAMPLES[0];
  const isDraftReady = item.id === CASE_EXAMPLES[0].id;

  return (
    <ConceptPage title={item.name} description={`${item.id} · 화면 예시 데이터`}
      action={<ConceptLink href="/cases">← 내 사건</ConceptLink>}>
      <ConceptCard className="mb-6">
        <dl className="grid gap-4 text-sm @xl:grid-cols-3">
          <div><dt className="mb-2 text-gre-muted">사건 업무 상태</dt>
            <dd><ConceptBadge tone={item.tone}>{item.status}</ConceptBadge></dd></div>
          <div><dt className="mb-2 text-gre-muted">판매자</dt>
            <dd>support@merchant.example</dd></div>
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
      <ConceptCard title="AI Run 추적" className="mb-6">
        <details open className="rounded-xl border border-gre-border p-4">
          <summary className="cursor-pointer font-semibold">Run 02 · 후속 대응 검토 완료</summary>
          <p className="mt-3 text-sm text-gre-muted">확인된 자료를 바탕으로 다음 대응을 준비했습니다.</p>
          <ul className="mt-3 space-y-2 text-sm text-gre-muted">
            <li>✓ 증빙 검토 AI · 주문 확인서와 결제 내역 확인</li>
            <li>✓ 정책 검토 AI · 판매자 환불 정책 확인</li>
          </ul>
        </details>
      </ConceptCard>
      <div className="grid gap-6 @3xl:grid-cols-2">
        <ConceptCard title="사건 타임라인">
          <ol className="mb-4 space-y-3 text-sm text-gre-muted">
            <li>11/18 · 후속 답변 준비 중</li>
            <li>11/16 · 판매자 회신 수신</li>
            <li>11/14 · 문의 이메일 발송</li>
          </ol>
          <ConceptLink href="/cases/detail/timeline">이메일 기록 보기</ConceptLink>
        </ConceptCard>
        <ConceptCard title="증빙 및 정책 근거">
          <p className="mb-4 text-sm text-gre-muted">주문 확인서 · 결제 내역 · 판매자 환불 정책</p>
          <ConceptLink href="/cases/detail/evidence">증빙·정책 근거 확인</ConceptLink>
        </ConceptCard>
      </div>
    </ConceptPage>
  );
}
