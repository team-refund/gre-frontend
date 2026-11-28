const SESSION_COOKIE = 'JSESSIONID';
const NO_STORE = { 'Cache-Control': 'no-store' };

export function proxyError(status, message) {
  return Response.json({ message }, { status, headers: NO_STORE });
}

export async function requestBackend(request, path) {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return proxyError(503, '백엔드 연결 주소가 설정되지 않았어요.');
  }

  const method = request.method;
  if (method !== 'GET' && request.headers.get('origin') !== request.nextUrl.origin) {
    return proxyError(403, '현재 화면에서 요청을 다시 보내 주세요.');
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    return proxyError(401, '마이페이지에서 로그인해 주세요.');
  }

  try {
    const target = new URL(path, baseUrl);
    const headers = new Headers({ Cookie: `${SESSION_COOKIE}=${encodeURIComponent(session)}` });
    const contentType = request.headers.get('content-type');
    if (contentType) headers.set('Content-Type', contentType);
    const body = method === 'POST' || method === 'PUT' ? await request.text() : undefined;
    return await fetch(target, {
      method,
      headers,
      body: body || undefined,
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return proxyError(502, '백엔드 응답을 확인할 수 없어요.');
  }
}

export function relayBackendResponse(upstream, location) {
  const headers = new Headers(NO_STORE);
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  if (location) headers.set('Location', location);
  for (const cookie of upstream.headers.getSetCookie()) {
    if (cookie.startsWith(`${SESSION_COOKIE}=`)) headers.append('Set-Cookie', cookie);
  }
  return new Response(location ? null : upstream.body, { status: upstream.status, headers });
}
