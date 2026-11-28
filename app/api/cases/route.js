import { relayBackendResponse, requestBackend } from '@/lib/api/sessionProxy';

export async function POST(request) {
  return relayBackendResponse(await requestBackend(request, '/api/cases'));
}
