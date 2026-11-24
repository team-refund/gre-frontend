export default function TopBar({ menuId, isMenuOpen, toggleButtonRef, onToggleMenu }) {
  return (
    <header
      className="flex h-14 shrink-0 items-center justify-between gap-4
        border-b border-gre-border bg-white px-2 @sm:px-4 @3xl:px-8"
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          ref={toggleButtonRef}
          onClick={onToggleMenu}
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? '메인 메뉴 닫기' : '메인 메뉴 열기'}
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg
            text-gre-text hover:bg-gre-selection focus-visible:outline-2
            focus-visible:outline-gre-accent"
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
        <span className="text-sm font-bold text-gre-accent">GRE</span>
        <span className="hidden text-sm font-medium text-gre-accent @3xl:inline">환불 에이전트</span>
      </div>
      <span className="hidden text-xs text-gre-muted @sm:inline">
        <span className="@3xl:hidden">사건 관리</span>
        <span className="hidden @3xl:inline">개인 워크스페이스</span>
      </span>
    </header>
  );
}
