'use client';

import { useEffect, useState } from 'react';

import { ConceptBadge, ConceptCard, ConceptLink } from '@/components/ui/ConceptLayout';
import {
  disconnectGmail,
  getGmailConnection,
  GMAIL_AUTHORIZE_PATH,
  GMAIL_CONNECTION_CHANGED,
  gmailErrorMessage,
  reconnectGmail,
} from '@/features/gmail/api/gmailApi';

import GmailDraftForm from './GmailDraftForm';
import GmailMessageList from './GmailMessageList';

const STATUS_LABELS = {
  CONNECTED: '연결됨',
  REAUTH_REQUIRED: '재연결 필요',
  DISCONNECTED: '연결 안 됨',
};
const OAUTH_ERRORS = {
  error: 'Google 연결을 완료하지 못했어요. 다시 시도해 주세요.',
  login: '마이페이지에서 로그인한 뒤 다시 연결해 주세요.',
};

export default function GmailConnectionPanel({ outcome }) {
  const [connection, setConnection] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [action, setAction] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getGmailConnection(controller.signal).then(setConnection).catch((failure) => {
      if (controller.signal.aborted) return;
      setNeedsLogin(failure.status === 401);
      setError(gmailErrorMessage(failure, 'Gmail 연결 상태를 확인하지 못했어요.'));
    });
    return () => controller.abort();
  }, [refreshCount]);

  function handleRefresh() {
    setError('');
    setNeedsLogin(false);
    setRefreshCount((count) => count + 1);
  }

  async function handleReconnect() {
    setAction('reconnect');
    setError('');
    try {
      const url = new URL(await reconnectGmail());
      if (url.origin !== 'https://accounts.google.com' || url.pathname !== '/o/oauth2/v2/auth') {
        throw new Error('Unexpected Google authorization URL');
      }
      window.location.assign(url);
    } catch (failure) {
      setError(gmailErrorMessage(failure, 'Gmail 재연결을 시작하지 못했어요.'));
      setAction('');
    }
  }

  async function handleDisconnect() {
    if (!window.confirm('이 Gmail 계정의 연결을 해제할까요?')) return;
    setAction('disconnect');
    setError('');
    setNotice('');
    try {
      const result = await disconnectGmail();
      setConnection({ status: result.status });
      window.dispatchEvent(new Event(GMAIL_CONNECTION_CHANGED));
      setNotice(result.revokeConfirmed
        ? 'Gmail 연결을 해제했어요.'
        : 'GRE 연결을 해제했어요. Google 계정에서 앱의 접근 권한을 확인해 주세요.');
      handleRefresh();
    } catch (failure) {
      setError(gmailErrorMessage(failure, 'Gmail 연결 해제를 완료하지 못했어요.'));
    } finally {
      setAction('');
    }
  }

  const isConnected = connection?.status === 'CONNECTED';
  const canDisconnect = isConnected || connection?.status === 'REAUTH_REQUIRED';
  const authError = Object.hasOwn(OAUTH_ERRORS, outcome) ? OAUTH_ERRORS[outcome] : '';

  return (
    <div className="grid gap-6">
      <ConceptCard title="Gmail 연결 정보">
        {!connection && !error && <p role="status">연결 상태를 확인하는 중이에요.</p>}
        {(error || authError) && (
          <p role="alert" className="mb-3 text-sm text-red-700">{error || authError}</p>
        )}
        {notice && <p role="status" className="mb-3 text-sm text-gre-muted">{notice}</p>}
        {connection && (
          <>
            <ConceptBadge tone={isConnected ? 'success' : 'danger'}>
              {STATUS_LABELS[connection.status] ?? '연결 상태 확인 필요'}
            </ConceptBadge>
            {canDisconnect && connection.googleEmail && (
              <p className="mt-2 wrap-anywhere text-sm">{connection.googleEmail}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {canDisconnect ? (
                <>
                  <button className="gre-button gre-button-primary" type="button"
                    disabled={Boolean(action)} onClick={handleReconnect}>
                    {action === 'reconnect' ? '연결 요청 중…' : 'Gmail 재연결'}
                  </button>
                  <button className="gre-button" type="button"
                    disabled={Boolean(action)} onClick={handleDisconnect}>
                    {action === 'disconnect' ? '해제 중…' : '연결 해제'}
                  </button>
                </>
              ) : (
                <a href={GMAIL_AUTHORIZE_PATH} className="gre-button gre-button-primary">
                  Gmail 연결
                </a>
              )}
            </div>
          </>
        )}
        {needsLogin && <ConceptLink href="/me">마이페이지에서 로그인</ConceptLink>}
        {!needsLogin && error && !connection && (
          <button type="button" className="gre-button" onClick={handleRefresh}>다시 확인</button>
        )}
      </ConceptCard>
      {isConnected && <GmailMessageList />}
      {isConnected && <GmailDraftForm />}
    </div>
  );
}
