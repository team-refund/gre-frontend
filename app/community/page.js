import Link from 'next/link';

const COMMUNITY_LINKS = [
  { href: '/community/create-post', label: '글쓰기' },
  { href: '/community/free-posts', label: '자유게시판 목록' },
  { href: '/community/question-posts', label: '질문게시판 목록' },
  { href: '/community/dispute-posts', label: '피해사례게시판 목록' },
];

export default function CommunityPage() {
  return (
    <main className="flex-1 p-6">
      <nav aria-label="커뮤니티">
        <ul className="flex flex-wrap gap-3">
          {COMMUNITY_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex min-h-11 items-center rounded-lg border border-gre-border
                  px-4 text-sm font-medium text-gre-accent hover:bg-gre-selection"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
