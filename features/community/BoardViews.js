import Link from 'next/link';
import {
  ConceptBadge, ConceptCard, ConceptLink, ConceptPage,
} from '@/components/ui/ConceptLayout';
import { BOARDS } from './boards';

function BoardTabs({ selected, isWriting = false }) {
  return (
    <nav aria-label="게시판 분류" className="mb-6 flex flex-wrap gap-2 rounded-[15px]
      border border-gre-border bg-white p-2">
      {BOARDS.map(({ slug, title }) => (
        <Link key={slug} aria-current={selected === slug ? 'page' : undefined}
          className={`gre-button ${selected === slug ? 'bg-gre-selection text-gre-accent' : ''}`}
          href={isWriting ? `/community/create-post?board=${slug}` : `/community/${slug}`}>
          {title}
        </Link>
      ))}
    </nav>
  );
}

export async function BoardList({ slug, searchParams }) {
  const params = await searchParams;
  const board = BOARDS.find((item) => item.slug === slug);

  return (
    <ConceptPage title={board.title} description={board.description}
      action={<ConceptLink href={`/community/create-post?board=${slug}`} primary>＋ 글쓰기</ConceptLink>}>
      <BoardTabs selected={slug} />
      {params?.preview === 'posted' && (
        <p className="mb-4 text-sm text-gre-muted" role="status">
          글 등록 후 돌아오는 화면입니다. 실제 게시글은 등록되지 않았습니다.
        </p>
      )}
      <ConceptCard title="전체 게시글">
        <p className="mb-2 text-sm text-gre-muted">예시 게시글 {board.posts.length}개</p>
        <ul className="divide-y divide-gre-border">
          {board.posts.map(([title, summary], index) => (
            <li key={title}>
              <Link className="block py-4 hover:text-gre-accent"
                href={`/community/${slug}/detail?post=${index}`}>
                <ConceptBadge tone="accent">{board.badge}</ConceptBadge>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-gre-muted">{summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </ConceptCard>
    </ConceptPage>
  );
}

export async function BoardDetail({ slug, searchParams }) {
  const params = await searchParams;
  const board = BOARDS.find((item) => item.slug === slug);
  const [title, summary] = board.posts[Number(params?.post)] ?? board.posts[0];

  return (
    <ConceptPage title={title} description={`${board.title} · 예시 게시글`}
      action={<ConceptLink href={`/community/${slug}`}>← 목록으로</ConceptLink>}>
      <ConceptCard><p className="min-h-32 text-sm leading-7">{summary}</p></ConceptCard>
      <ConceptCard className="mt-6" title="댓글">
        <textarea aria-label="댓글" className="gre-field min-h-24"
          placeholder="경험이나 도움이 되는 내용을 남겨 주세요." />
        <div className="mt-3">
          <ConceptLink href={`/community/${slug}/detail?post=${
            board.posts.findIndex(([name]) => name === title)
          }&preview=comment`} primary>댓글 등록</ConceptLink>
        </div>
        {params?.preview === 'comment' && (
          <p className="mt-3 text-sm text-gre-muted" role="status">
            댓글 등록 후의 화면입니다. 실제 댓글은 등록되지 않았습니다.
          </p>
        )}
      </ConceptCard>
    </ConceptPage>
  );
}

export async function BoardCompose({ searchParams }) {
  const params = await searchParams;
  const board = BOARDS.find((item) => item.slug === params?.board) ?? BOARDS[0];
  const isQuestion = board.slug === 'question-posts';
  const isDispute = board.slug === 'dispute-posts';

  return (
    <ConceptPage title={`${board.title} 글쓰기`} description={board.description}>
      <BoardTabs selected={board.slug} isWriting />
      {isDispute && (
        <ConceptCard className="mb-6" title="01 내 사건 연결">
          <p className="text-sm text-gre-muted">이미 등록한 사건에서 필요한 정보를 불러옵니다.</p>
          <select className="gre-field mt-4" aria-label="내 사건 선택" disabled>
            <option>연결할 환불·교환 사건을 선택해 주세요</option>
          </select>
        </ConceptCard>
      )}
      <ConceptCard title={isDispute ? '02 게시글 내용' : '01 게시글 내용'}>
        {isQuestion && <label className="gre-label mb-4">사건 유형 *
          <select className="gre-field">
            <option>환불·반품</option><option>교환</option><option>배송</option>
          </select>
        </label>}
        <label className="gre-label">제목 *<input className="gre-field"
          placeholder="제목을 입력해 주세요." /></label>
        <label className="gre-label mt-4">내용 *<textarea className="gre-field min-h-48"
          placeholder="공유하고 싶은 내용을 작성해 주세요." /></label>
        <label className="gre-label mt-4">이미지 첨부
          <input className="gre-field" type="file" accept="image/jpeg,image/png" multiple />
        </label>
      </ConceptCard>
      {isDispute && <ConceptCard className="mt-6" title="03 공개 정보 확인">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" /> 사업자명 공개하기
        </label>
        <p className="mt-3 text-sm text-gre-muted">연락처, 주문번호, 이메일은 가려 주세요.</p>
      </ConceptCard>}
      {isQuestion && <div className="mt-4"><ConceptBadge tone="accent">질문 상태 · OPEN</ConceptBadge></div>}
      <div className="mt-5 flex items-center justify-end gap-2">
        <ConceptLink href={`/community/${board.slug}`}>취소</ConceptLink>
        <ConceptLink href={`/community/${board.slug}?preview=posted`} primary>게시글 등록</ConceptLink>
      </div>
    </ConceptPage>
  );
}
