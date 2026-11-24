'use client';

import { useCurrentUser } from '@/contexts/CurrentUserContext';

export default function CurrentUserInfo({ children, signedOutContent }) {
  const { userId, setUserId } = useCurrentUser();

  if (!userId) {
    return signedOutContent;
  }

  function handleLogout() {
    setUserId(null);
  }

  return (
    <section aria-labelledby="current-user-heading" className="mt-6">
      <h2 id="current-user-heading" className="text-lg font-semibold">내 정보</h2>
      <p role="status" className="mt-2 text-sm">
        로그인 ID {userId}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-lg border border-gre-border px-4 py-2 text-sm font-medium
            text-gre-accent hover:bg-gre-selection"
        >
          로그아웃
        </button>
        {children}
      </div>
    </section>
  );
}
