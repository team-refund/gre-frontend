import { httpClient } from '@/lib/api/httpClient';

export async function getEmailDraft(draftId, signal) {
  const { data } = await httpClient(`/api/email-drafts/${draftId}`, { signal });
  return data;
}

export async function approveEmailDraft(draftId, draft) {
  const { data } = await httpClient(`/api/email-drafts/${draftId}/approve`, {
    method: 'POST',
    data: draft,
  });
  return data;
}

export async function sendEmailDraft(draftId, requestKey) {
  const { data } = await httpClient(`/api/email-drafts/${draftId}/send`, {
    method: 'POST',
    data: { requestKey },
  });
  return data;
}

export async function getEmailSendAttempts(draftId, signal) {
  const { data } = await httpClient(`/api/email-drafts/${draftId}/send-attempts`, { signal });
  return data;
}
