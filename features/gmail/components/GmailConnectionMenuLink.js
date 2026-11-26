'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { getGmailConnection, GMAIL_CONNECTION_CHANGED } from '@/features/gmail/api/gmailApi';

const STATUS_LABELS = {
  CONNECTED: '연결됨',
  REAUTH_REQUIRED: '재연결 필요',
  DISCONNECTED: '연결 안 됨',
};

export default function GmailConnectionMenuLink({ pathname }) {
  const { userId } = useCurrentUser();
  const [status, setStatus] = useState('DISCONNECTED');

  useEffect(() => {
    let controller;

    function refreshConnection() {
      controller?.abort();
      controller = new AbortController();
      const { signal } = controller;
      getGmailConnection(signal).then((connection) => {
        if (!signal.aborted) setStatus(connection.status);
      }).catch(() => {
        if (!signal.aborted) setStatus('DISCONNECTED');
      });
    }

    refreshConnection();
    window.addEventListener(GMAIL_CONNECTION_CHANGED, refreshConnection);
    return () => {
      controller?.abort();
      window.removeEventListener(GMAIL_CONNECTION_CHANGED, refreshConnection);
    };
  }, [pathname, userId]);

  const isConnected = status === 'CONNECTED';
  const color = isConnected ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700';

  return (
    <Link href="/me/gmail-connections" className={`mt-5 block rounded-xl px-3.5 py-4 ${color}`}>
      <span className="flex items-center gap-1.5 text-xs font-bold">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-current" />
        Gmail 연결 관리
      </span>
      <span className="mt-1.5 block text-xs" aria-live="polite">
        {STATUS_LABELS[status] ?? STATUS_LABELS.DISCONNECTED}
      </span>
    </Link>
  );
}
