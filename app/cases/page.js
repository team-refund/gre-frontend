import { ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import CaseList from '@/features/cases/CaseList';

export default function CaseListPage() {
  return (
    <ConceptPage
      title="내 사건"
      description="사건별 진행 상황과 다음에 필요한 행동을 확인하세요."
      action={<ConceptLink href="/cases/register" primary>＋ 새 사건 등록</ConceptLink>}
    >
      <CaseList />
    </ConceptPage>
  );
}
