import {
  ConceptBadge, ConceptCard, ConceptLink, ConceptPage,
} from '@/components/ui/ConceptLayout';
import CaseRegistration from '@/features/cases/CaseRegistration';

const REGISTER_PATH = '/cases/register';

export default async function CaseRegistrationPage({ searchParams }) {
  const { step, id } = await searchParams;

  if (step === 'processing') {
    return (
      <ConceptPage title="사건 처리 중"
        action={<ConceptLink href={REGISTER_PATH}>← 사건 등록</ConceptLink>}>
        <div className="mb-5">
          <ConceptBadge tone="accent">화면 미리보기 · 실제 사건은 처리되지 않습니다</ConceptBadge>
        </div>
        <ConceptCard title="AI 분석 상태">
          <p className="mb-4 text-sm text-gre-muted">
            사건이 등록된 뒤 분석이 진행되는 상태의 화면입니다.
          </p>
          <ConceptLink href={{ pathname: '/cases/detail', query: id ? { id } : {} }} primary>
            사건 상세 보기
          </ConceptLink>
        </ConceptCard>
      </ConceptPage>
    );
  }

  return (
    <ConceptPage title="새 사건 등록"
      description="주문·결제 사실과 원하는 해결 방법을 알려주세요.">
      <CaseRegistration />
    </ConceptPage>
  );
}
