import Link from 'next/link';
import { ConceptBadge, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import { BOARDS } from '@/features/community/boards';

export default function CommunityPage() {
  return (
    <ConceptPage title="서로의 경험이 도움이 되는 공간"
      description="해외직구 환불·교환 고민을 나누고, 해결 과정을 함께 공유해 보세요."
      action={<ConceptLink href="/community/create-post" primary>＋ 글쓰기</ConceptLink>}>
      <div className="mb-7 rounded-[15px] bg-gre-selection px-6 py-5">
        <p className="text-xs font-semibold text-gre-accent">GRE COMMUNITY</p>
        <h2 className="mt-1 text-xl font-bold">같은 고민, 더 나은 해결</h2>
        <p className="mt-2 text-sm text-gre-muted">자유게시판 · 질문 게시판 · 피해사례 게시판</p>
      </div>
      {BOARDS.map(({ slug, title, description, posts, badge }) => (
        <section key={slug} className="mb-7">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-1 text-sm text-gre-muted">{description}</p></div>
            <Link className="shrink-0 text-sm text-gre-accent" href={`/community/${slug}`}>
              더보기 →
            </Link>
          </div>
          <div className="grid gap-4 @3xl:grid-cols-3">
            {posts.map(([name, summary], index) => (
              <Link className="min-w-0 rounded-[15px] border border-gre-border bg-white p-5
                hover:border-gre-accent" key={name}
              href={`/community/${slug}/detail?post=${index}`}>
                <ConceptBadge tone="accent">{badge}</ConceptBadge>
                <h3 className="mt-3 text-sm font-semibold">{name}</h3>
                <p className="mt-2 text-xs leading-5 text-gre-muted">{summary}</p>
                <p className="mt-3 border-t border-gre-border pt-3 text-xs text-gre-muted">예시 게시글</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </ConceptPage>
  );
}
