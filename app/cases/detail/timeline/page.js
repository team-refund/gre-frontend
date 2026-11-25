import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';

export default function CaseTimelinePage() {
  return <ConceptPage title="이메일 기록" description="판매자와의 이메일과 사건 상태 변경 이력 · 예시"
    action={<ConceptLink href="/cases/detail">← 사건 상세</ConceptLink>}>
    <ConceptCard title="사건 타임라인">
      <ol className="divide-y divide-gre-border text-sm">
        <li className="py-4">11/18 · 후속 답변 준비 중</li>
        <li className="py-4">11/16 · 판매자 회신 수신</li>
        <li className="py-4">11/14 · 문의 이메일 발송</li>
      </ol>
    </ConceptCard>
  </ConceptPage>;
}
