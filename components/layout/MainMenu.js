import Link from 'next/link';

const MENU_ITEMS = [
  {
    label: '홈',
    href: '/',
    icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  },
  { label: '내 사건', href: '/cases', icon: 'M3 6h7l2 3h9v10H3z' },
  { label: '사건 등록', href: '/cases/register', icon: 'M12 5v14 M5 12h14' },
  {
    label: '커뮤니티',
    href: '/community',
    icon: 'M21 11a8 8 0 0 1-8 8H4l2-4a8 8 0 1 1 15-4Z',
  },
  {
    label: '마이페이지',
    href: '/me',
    icon: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z M5 21v-2a7 7 0 0 1 14 0v2',
  },
];

export default function MainMenu({ id, pathname, isHome, closeButtonRef, onCloseMenu }) {
  const activeItem =
    MENU_ITEMS.find(({ href }) => href === pathname) ??
    MENU_ITEMS.findLast(({ href }) => pathname.startsWith(`${href}/`));

  return (
    <aside
      id={id}
      className="h-full w-[min(232px,65vw)] border-r border-gre-border bg-white px-6 py-10
        text-gre-text"
    >
      <div className="relative border-b border-gre-border pb-5">
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onCloseMenu}
          aria-label="메인 메뉴 닫기"
          className={`absolute -top-1 right-0 grid size-10 cursor-pointer place-items-center
            rounded-lg hover:bg-gre-selection focus-visible:outline-2
            focus-visible:outline-gre-accent ${isHome ? 'xl:hidden' : ''}`}
        >
          <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <div className="flex items-start gap-1">
          <span className="text-[32px] leading-none font-bold tracking-tight text-gre-accent">
            GRE
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gre-brand-dot" />
        </div>
        <p className="mt-5 text-xs text-gre-muted">해외 직구 환불 AI 에이전트</p>
      </div>

      <nav aria-label="메인 메뉴" className="mt-5">
        <p aria-hidden="true" className="mb-4 text-[10px] font-semibold text-gre-muted">
          WORKSPACE
        </p>
        <ul className="grid gap-5">
          {MENU_ITEMS.map(({ label, href, icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={href === pathname ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm ${
                  href === activeItem?.href
                    ? 'bg-gre-selection font-semibold text-gre-accent'
                    : 'text-gre-muted hover:bg-gre-selection'
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="size-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={icon} />
                </svg>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link
        href="/me/gmail-connections"
        className="mt-5 block rounded-xl bg-[#eaf8f3] px-3.5 py-4"
      >
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#187f66]">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-current" />
          {isHome ? 'Gmail 연결됨' : 'Gmail 연결 관리'}
        </span>
        <span className="mt-1.5 block text-[11px] text-gre-muted">승인된 메일만 발송합니다</span>
      </Link>
    </aside>
  );
}
