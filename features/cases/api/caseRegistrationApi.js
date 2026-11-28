import { httpClient } from '@/lib/api/httpClient';

export async function createCase(payload) {
  const { data } = await httpClient('/api/cases', { method: 'POST', data: payload });
  if (!Number.isSafeInteger(data?.caseId) || data.caseId < 1) {
    throw new Error('Invalid case registration response');
  }
  return data.caseId;
}
