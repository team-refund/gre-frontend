'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import MainMenu from './MainMenu';
import TopBar from './TopBar';

const MENU_ID = 'main-menu';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const gridColumns = isMenuOpen
    ? 'grid-cols-[min(232px,65vw)_minmax(0,1fr)]'
    : 'grid-cols-[0px_minmax(0,1fr)]';

  useEffect(() => {
    if (isMenuOpen && document.activeElement === toggleButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMenuOpen]);

  function handleCloseMenu() {
    toggleButtonRef.current.focus();
    setIsMenuOpen(false);
  }

  function handleToggleMenu() {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  return (
    <div
      className={`grid min-h-dvh motion-safe:transition-[grid-template-columns]
        motion-safe:duration-220 motion-safe:ease-out ${gridColumns}`}
    >
      <div className="min-w-0 overflow-hidden" inert={!isMenuOpen}>
        <MainMenu
          id={MENU_ID}
          pathname={pathname}
          isHome={isHome}
          closeButtonRef={closeButtonRef}
          onCloseMenu={handleCloseMenu}
        />
      </div>
      <div className="@container flex min-w-0 flex-col">
        <TopBar
          isHome={isHome}
          menuId={MENU_ID}
          isMenuOpen={isMenuOpen}
          toggleButtonRef={toggleButtonRef}
          onToggleMenu={handleToggleMenu}
        />
        {children}
      </div>
    </div>
  );
}
