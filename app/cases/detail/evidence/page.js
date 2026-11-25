import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';

export default function CaseEvidencePage() {
  return <ConceptPage title="증빙 및 정책 근거" description="거래 증빙과 검토한 환불 정책 · 예시"
    action={<ConceptLink href="/cases/detail">← 사건 상세</ConceptLink>}>
    <div className="grid gap-6 @3xl:grid-cols-2">
      <ConceptCard title="증빙 자료">
        <ul className="space-y-3 text-sm"><li>주문 확인서</li><li>결제 내역</li></ul>
      </ConceptCard>
      <ConceptCard title="정책 근거">
        <p className="text-sm text-gre-muted">판매자 환불 정책과 출처를 확인하는 영역입니다.</p>
      </ConceptCard>
    </div>
  </ConceptPage>;
}
