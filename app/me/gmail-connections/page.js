import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';

export default function GmailConnectionPage() {
  return (
    <ConceptPage title="Gmail 연결" description="사건에 필요한 이메일을 확인하는 데 사용합니다."
      action={<ConceptLink href="/me">← 마이페이지</ConceptLink>}>
      <ConceptCard title="Gmail 연결 정보">
        <p className="text-sm text-gre-muted">이 화면에서는 Gmail 연결 상태를 확인할 수 없습니다.</p>
        <button className="gre-button gre-button-primary mt-4" disabled>Gmail 연결</button>
      </ConceptCard>
    </ConceptPage>
  );
}
