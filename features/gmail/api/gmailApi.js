import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { httpClient } from '@/lib/api/httpClient';

export const GMAIL_AUTHORIZE_PATH = '/api/gmail/oauth2/authorize';
export const GMAIL_CONNECTION_CHANGED = 'gre:gmail-connection-changed';

export async function getGmailConnection(signal) {
  const { data } = await httpClient('/api/gmail/connection', { signal });
  return data;
}

export async function reconnectGmail() {
  const { data } = await httpClient('/api/gmail/connection/reconnect', { method: 'POST' });
  return data.authorizationUrl;
}

export async function disconnectGmail() {
  const { data } = await httpClient('/api/gmail/connection', { method: 'DELETE' });
  return data;
}

export async function searchGmailMessages(query, pageToken) {
  const { data } = await httpClient('/api/gmail/messages', {
    params: { q: query || undefined, pageToken: pageToken || undefined },
  });
  return data;
}

export async function createGmailDraft(draft) {
  const { data } = await httpClient('/api/gmail/drafts', { method: 'POST', data: draft });
  return data;
}

export function gmailErrorMessage(error, fallback) {
  const code = error?.code;
  if (error?.status === 401) return '마이페이지에서 로그인해 주세요.';
  if (code === 'GMAIL_NOT_CONNECTED') return '마이페이지에서 Gmail을 먼저 연결해 주세요.';
  if (code === 'GMAIL_REAUTH_REQUIRED' || code === 'GMAIL_SCOPE_REQUIRED') {
    return 'Gmail 연결을 다시 설정해 주세요.';
  }
  return getApiErrorMessage(error, fallback);
}
