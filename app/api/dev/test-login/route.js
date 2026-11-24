import axios from 'axios';

export async function POST(request) {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (process.env.NODE_ENV !== 'development' || !apiBaseUrl) {
    return new Response(null, { status: 404 });
  }

  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return new Response(null, { status: 415 });
  }

  const body = await request.json().catch(() => null);
  const loginId = typeof body?.loginId === 'string' ? body.loginId.trim() : '';
  if (!loginId || loginId.length > 50) {
    return new Response(null, { status: 400 });
  }

  try {
    const headers = {};
    const session = request.cookies.get('JSESSIONID');
    if (session) {
      headers.Cookie = `JSESSIONID=${encodeURIComponent(session.value)}`;
    }

    const url = new URL('/api/dev/test-login', apiBaseUrl).href;
    const response = await axios.post(url, { loginId }, {
      headers,
      maxRedirects: 0,
      validateStatus: () => true,
    });

    if (response.status !== 204) {
      return new Response(null, { status: response.status >= 400 ? response.status : 502 });
    }

    const responseHeaders = new Headers({ 'Cache-Control': 'no-store' });
    for (const cookie of response.headers['set-cookie'] ?? []) {
      if (cookie.startsWith('JSESSIONID=')) {
        responseHeaders.append('Set-Cookie', cookie);
      }
    }
    return new Response(null, { status: 204, headers: responseHeaders });
  } catch {
    return new Response(null, { status: 502 });
  }
}
