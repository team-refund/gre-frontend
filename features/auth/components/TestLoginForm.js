'use client';

import { useState } from 'react';

import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { testLogin } from '@/features/auth/api/testLogin';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';

export default function TestLoginForm() {
  const { setUserId } = useCurrentUser();
  const [inputId, setInputId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (isSubmitting) return;

    const loginId = inputId.trim();
    if (!loginId) {
      setError('로그인 ID를 입력해 주세요.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await testLogin(loginId);
      setUserId(loginId);
    } catch (error) {
      setError(getApiErrorMessage(error, '테스트 로그인에 실패했어요.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleLogin();
    }
  }

  return (
    <div className="mt-6 flex max-w-sm flex-col gap-2">
      <label htmlFor="test-login-id" className="text-sm font-medium">
        테스트 로그인 ID
      </label>
      <input
        id="test-login-id"
        value={inputId}
        onChange={(event) => setInputId(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        maxLength={50}
        className="rounded-lg border border-gre-border px-3 py-2"
      />
      <button
        type="button"
        onClick={handleLogin}
        disabled={isSubmitting}
        className="self-start rounded-lg bg-gre-accent px-4 py-2 text-sm text-white
          disabled:opacity-50"
      >
        테스트 로그인
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
