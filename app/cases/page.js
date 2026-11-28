import { ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import CaseList from '@/features/cases/CaseList';
import { getCases } from '@/features/cases/api/caseApi';
import { toCaseListItem } from '@/features/cases/caseDisplay';

const MAX_PAGE_NUMBER = 2_147_483_647;

export default async function CaseListPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const requestedPage = typeof pageParam === 'string' ? Number(pageParam) : 0;
  const page = Number.isInteger(requestedPage) && requestedPage >= 0
    && requestedPage <= MAX_PAGE_NUMBER ? requestedPage : 0;
  const { data, errorMessage } = await getCases(page);

  return (
    <ConceptPage
      title="내 사건"
      description="사건별 진행 상황과 다음에 필요한 행동을 확인하세요."
      action={<ConceptLink href="/cases/register" primary>＋ 새 사건 등록</ConceptLink>}
    >
      {data ? (
        <>
          <CaseList cases={data.cases.map(toCaseListItem)} />
          <nav className="mt-4 flex gap-3" aria-label="사건 목록 페이지">
            <span className="self-center text-sm text-gre-muted">서버 등록 사건 총 {data.totalElements}건</span>
            {page > 0 && <ConceptLink href={`/cases?page=${page - 1}`}>이전</ConceptLink>}
            {(page + 1) * data.size < data.totalElements && (
              <ConceptLink href={`/cases?page=${page + 1}`}>다음</ConceptLink>
            )}
          </nav>
        </>
      ) : (
        <p role="alert">{errorMessage}</p>
      )}
    </ConceptPage>
  );
}
