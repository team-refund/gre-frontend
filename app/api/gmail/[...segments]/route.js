import { proxyError, relayBackendResponse, requestBackend } from '@/lib/api/sessionProxy';

const CONNECTION_PAGE = '/me/gmail-connections';
const GMAIL_ROUTES = {
  GET: new Set(['connection', 'messages', 'oauth2/authorize', 'oauth2/callback']),
  POST: new Set(['connection/reconnect', 'drafts']),
  DELETE: new Set(['connection']),
};

async function handleGmailRequest(request, { params }) {
  const { segments } = await params;
  const route = segments.join('/');
  if (!GMAIL_ROUTES[request.method]?.has(route)) {
    return proxyError(404, 'Gmail API 경로를 찾을 수 없어요.');
  }

  const path = `/api/gmail/${route}${request.nextUrl.search}`;
  const upstream = await requestBackend(request, path);
  if (route === 'oauth2/authorize' && upstream.status === 302) {
    const location = upstream.headers.get('location');
    if (location?.startsWith('https://accounts.google.com/o/oauth2/v2/auth?')) {
      return relayBackendResponse(upstream, location);
    }
  }

  if (route.startsWith('oauth2/')) {
    const outcome = route === 'oauth2/callback' && [200, 303].includes(upstream.status)
      ? 'connected'
      : upstream.status === 401 ? 'login' : 'error';
    return new Response(null, {
      status: 303,
      headers: { Location: `${CONNECTION_PAGE}?gmail=${outcome}`, 'Cache-Control': 'no-store' },
    });
  }

  return relayBackendResponse(upstream);
}

export { handleGmailRequest as GET, handleGmailRequest as POST, handleGmailRequest as DELETE };
