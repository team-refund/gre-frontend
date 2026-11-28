import { proxyError, relayBackendResponse, requestBackend } from '@/lib/api/sessionProxy';

const EMAIL_DRAFT_ROUTES = {
  GET: new Set(['', 'send-attempts']),
  PUT: new Set(['']),
  POST: new Set(['approve', 'send']),
};

async function handleEmailDraftRequest(request, { params }) {
  const { draftId, action } = await params;
  const route = action?.join('/') ?? '';
  if (!/^[1-9]\d{0,18}$/.test(draftId) || !EMAIL_DRAFT_ROUTES[request.method]?.has(route)) {
    return proxyError(404, '이메일 초안 API 경로를 찾을 수 없어요.');
  }

  const path = route ? `/api/email-drafts/${draftId}/${route}` : `/api/email-drafts/${draftId}`;
  return relayBackendResponse(await requestBackend(request, path));
}

export { handleEmailDraftRequest as GET, handleEmailDraftRequest as POST, handleEmailDraftRequest as PUT };
