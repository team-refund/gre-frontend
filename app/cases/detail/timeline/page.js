import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import CaseTimeline from '@/features/cases/CaseTimeline';

export default async function CaseTimelinePage({ searchParams }) {
  const { id } = await searchParams;
  const detailHref = id ? { pathname: '/cases/detail', query: { id } } : '/cases/detail';

  return <ConceptPage title="사건 타임라인" description="판매자와의 이메일과 사건 상태 변경 이력 · 예시"
    action={<ConceptLink href={detailHref}>← 사건 상세</ConceptLink>}>
    <ConceptCard>
      <CaseTimeline />
    </ConceptCard>
  </ConceptPage>;
}
