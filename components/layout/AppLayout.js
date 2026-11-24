'use client';

import { useEffect, useRef, useState } from 'react';

import MainMenu from './MainMenu';
import TopBar from './TopBar';

const MENU_ID = 'main-menu';

export default function AppLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const toggleButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

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
        motion-safe:duration-220 motion-safe:ease-out ${
          isMenuOpen ? 'grid-cols-[min(230px,65vw)_minmax(0,1fr)]' : 'grid-cols-[0px_minmax(0,1fr)]'
        }`}
    >
      <div className="min-w-0 overflow-hidden" inert={!isMenuOpen}>
        <MainMenu id={MENU_ID} closeButtonRef={closeButtonRef} onCloseMenu={handleCloseMenu} />
      </div>
      <div className="@container flex min-w-0 flex-col">
        <TopBar
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
