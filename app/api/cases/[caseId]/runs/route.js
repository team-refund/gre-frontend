import { proxyError, relayBackendResponse, requestBackend } from '@/lib/api/sessionProxy';

export async function POST(request, { params }) {
  const { caseId } = await params;
  if (!/^[1-9]\d{0,18}$/.test(caseId)) {
    return proxyError(404, '사건을 찾을 수 없어요.');
  }

  const upstream = await requestBackend(request, `/api/cases/${caseId}/runs`);
  return relayBackendResponse(upstream);
}
