const PAGE_TITLES = {
  '/cases': '내 사건',
  '/cases/register': '사건 등록',
  '/cases/detail': '사건 상세',
  '/cases/detail/email-draft': '이메일 초안',
  '/cases/detail/evidence': '증빙 및 정책',
  '/cases/detail/timeline': '이메일 기록',
  '/community': '커뮤니티 / 전체',
  '/community/free-posts': '커뮤니티 / 자유 게시판',
  '/community/question-posts': '커뮤니티 / 질문 게시판',
  '/community/dispute-posts': '커뮤니티 / 피해사례',
  '/community/create-post': '커뮤니티 / 글쓰기',
  '/me': '마이페이지',
  '/me/gmail-connections': 'Gmail 연결',
};

export default function TopBar({
  pathname, isHome, menuId, isMenuOpen, toggleButtonRef, onToggleMenu,
}) {
  const title = PAGE_TITLES[pathname] ??
    (pathname?.startsWith('/community/') ? '커뮤니티 / 게시글 상세' : 'GRE');

  return (
    <header
      className="flex h-[54px] shrink-0 items-center justify-between gap-4
        bg-white px-2 @sm:px-4 @4xl:px-12"
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          ref={toggleButtonRef}
          onClick={onToggleMenu}
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? '메인 메뉴 닫기' : '메인 메뉴 열기'}
          className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg
            text-gre-text hover:bg-gre-selection focus-visible:outline-2
            focus-visible:outline-gre-accent ${isHome && isMenuOpen ? '@4xl:hidden' : ''}`}
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
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="truncate text-[13px] text-gre-accent">
          GRE / {isHome ? '홈' : title}
        </span>
      </div>
      <span className="hidden shrink-0 text-[13px] text-gre-muted @sm:inline">
        개인 워크스페이스
      </span>
    </header>
  );
}
