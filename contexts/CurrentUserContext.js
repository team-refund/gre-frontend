'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function CurrentUserProvider({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && userId !== null) {
      console.info('[로그인] 전역 상태에 저장된 userId', userId);
    }
  }, [userId]);

  return (
    <CurrentUserContext value={{ userId, setUserId }}>
      {children}
    </CurrentUserContext>
  );
}

export function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext);
  if (currentUser === null) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider.');
  }

  return currentUser;
}
