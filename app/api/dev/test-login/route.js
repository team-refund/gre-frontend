import axios from 'axios';

const TEST_LOGIN_PATH = '/api/dev/test-login';
const SESSION_COOKIE_NAME = 'JSESSIONID';
const MAX_LOGIN_ID_LENGTH = 50;

export async function POST(request) {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (process.env.NODE_ENV !== 'development' || !apiBaseUrl) {
    return new Response(null, { status: 404 });
  }

  const contentType = request.headers.get('content-type');
  if (!contentType?.startsWith('application/json')) {
    return new Response(null, { status: 415 });
  }

  const body = await request.json().catch(() => null);
  const loginId = typeof body?.loginId === 'string' ? body.loginId.trim() : '';
  if (!loginId || loginId.length > MAX_LOGIN_ID_LENGTH) {
    return new Response(null, { status: 400 });
  }

  try {
    const session = request.cookies.get(SESSION_COOKIE_NAME);
    const requestHeaders = session
      ? { Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(session.value)}` }
      : {};
    const backendUrl = new URL(TEST_LOGIN_PATH, apiBaseUrl).href;
    const backendResponse = await axios.post(backendUrl, { loginId }, {
      headers: requestHeaders,
      maxRedirects: 0,
      validateStatus: () => true,
    });

    if (backendResponse.status !== 204) {
      const status = backendResponse.status >= 400 ? backendResponse.status : 502;
      return new Response(null, { status });
    }

    const responseHeaders = new Headers({ 'Cache-Control': 'no-store' });
    for (const cookie of backendResponse.headers['set-cookie'] ?? []) {
      if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
        responseHeaders.append('Set-Cookie', cookie);
      }
    }
    return new Response(null, { status: 204, headers: responseHeaders });
  } catch {
    return new Response(null, { status: 502 });
  }
}
