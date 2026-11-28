import Link from 'next/link';
import {
  ConceptBadge, ConceptCard, ConceptLink, ConceptPage,
} from '@/components/ui/ConceptLayout';
import { BOARDS, getQuestionDiscussion } from './boards';

const POST_DATE_FORMAT = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
});

const POSTS_PER_PAGE = 2;
const QUESTION_FILTERS = [
  ['all', '전체'], ['open', '열림'], ['closed', '답변 완료'],
];

function PostMetadata({ author, updatedAt }) {
  return (
    <>
      작성자 {author} · 최근 수정{' '}
      <time dateTime={updatedAt}>{POST_DATE_FORMAT.format(new Date(updatedAt))}</time>
    </>
  );
}

function boardListHref(slug, status, page = 1) {
  const query = {};
  if (status !== 'all') query.status = status;
  if (page > 1) query.page = String(page);
  return { pathname: `/community/${slug}`, query };
}

function QuestionStatus({ status }) {
  const isClosed = status === 'closed';
  return (
    <ConceptBadge tone={isClosed ? 'success' : 'accent'}>
      {isClosed ? '답변 완료' : '열림'}
    </ConceptBadge>
  );
}

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
  const isQuestion = slug === 'question-posts';
  const status = isQuestion && QUESTION_FILTERS.some(([value]) => value === params?.status)
    ? params.status : 'all';
  const posts = board.posts.map((post, index) => ({
    post, index, status: isQuestion ? getQuestionDiscussion(index).status : null,
  })).filter((item) => status === 'all' || item.status === status);
  const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const requestedPage = Number(params?.page);
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(Math.max(1, requestedPage), pageCount) : 1;
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

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
        {isQuestion && (
          <nav aria-label="질문 상태 필터" className="mb-4 flex flex-wrap gap-2">
            {QUESTION_FILTERS.map(([value, label]) => (
              <Link key={value} href={boardListHref(slug, value)}
                aria-current={value === status ? 'true' : undefined}
                className={value === status ? 'gre-button gre-button-primary' : 'gre-button'}>
                {label}
              </Link>
            ))}
          </nav>
        )}
        <p className="mb-2 text-sm text-gre-muted">예시 게시글 {posts.length}개</p>
        <ul className="divide-y divide-gre-border">
          {pagePosts.map(({ post: [title, summary, metadata], index, status: postStatus }) => (
            <li key={title}>
              <Link className="block py-4 hover:text-gre-accent"
                href={`/community/${slug}/detail?post=${index}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <ConceptBadge tone="accent">{board.badge}</ConceptBadge>
                  {postStatus && <QuestionStatus status={postStatus} />}
                </div>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-gre-muted">{summary}</p>
                <p className="mt-2 text-xs text-gre-muted"><PostMetadata {...metadata} /></p>
              </Link>
            </li>
          ))}
        </ul>
        {posts.length === 0 && <p className="py-6 text-sm text-gre-muted">게시글이 없습니다.</p>}
        {pageCount > 1 && (
          <nav aria-label="게시글 페이지" className="mt-5 flex flex-wrap justify-center gap-2">
            {page > 1 && <ConceptLink href={boardListHref(slug, status, page - 1)}>이전</ConceptLink>}
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <Link key={number} href={boardListHref(slug, status, number)}
                aria-label={`${number} 페이지`} aria-current={number === page ? 'page' : undefined}
                className={number === page ? 'gre-button gre-button-primary' : 'gre-button'}>
                {number}
              </Link>
            ))}
            {page < pageCount && (
              <ConceptLink href={boardListHref(slug, status, page + 1)}>다음</ConceptLink>
            )}
          </nav>
        )}
      </ConceptCard>
    </ConceptPage>
  );
}

export async function BoardDetail({ slug, searchParams }) {
  const params = await searchParams;
  const board = BOARDS.find((item) => item.slug === slug);
  const requestedIndex = Number(params?.post);
  const postIndex = board.posts[requestedIndex] ? requestedIndex : 0;
  const [title, summary, metadata] = board.posts[postIndex];
  const discussion = slug === 'question-posts' ? getQuestionDiscussion(postIndex) : null;
  const { accepted, comments = [] } = discussion ?? {};

  return (
    <ConceptPage title={title}
      description={(
        <>
          {board.title} · 예시 게시글 · <PostMetadata {...metadata} />
        </>
      )}
      action={<ConceptLink href={`/community/${slug}`}>← 목록으로</ConceptLink>}>
      <ConceptCard>
        {discussion && <div className="mb-3"><QuestionStatus status={discussion.status} /></div>}
        <p className="min-h-32 text-sm leading-7">{summary}</p>
      </ConceptCard>
      {accepted && (
        <ConceptCard className="mt-6 border-emerald-200 bg-emerald-50/40" title="채택된 답변">
          <p className="text-sm font-semibold">{accepted.author}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{accepted.body}</p>
        </ConceptCard>
      )}
      <ConceptCard className="mt-6" title="댓글">
        {comments.length > 0 && (
          <ul className="mb-4 divide-y divide-gre-border">
            {comments.map(({ id, author, body }) => (
              <li key={id} className="py-3">
                <p className="text-sm font-semibold">{author}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-7">{body}</p>
              </li>
            ))}
          </ul>
        )}
        <textarea aria-label="댓글" className="gre-field min-h-24"
          placeholder="경험이나 도움이 되는 내용을 남겨 주세요." />
        <div className="mt-3">
          <ConceptLink href={`/community/${slug}/detail?post=${postIndex}&preview=comment`} primary>
            댓글 등록
          </ConceptLink>
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
      {isQuestion && <div className="mt-4"><QuestionStatus status="open" /></div>}
      <div className="mt-5 flex items-center justify-end gap-2">
        <ConceptLink href={`/community/${board.slug}`}>취소</ConceptLink>
        <ConceptLink href={`/community/${board.slug}?preview=posted`} primary>게시글 등록</ConceptLink>
      </div>
    </ConceptPage>
  );
}
