import { httpClient } from '@/lib/api/httpClient';

export async function submitCaseRequirement(caseId, requirement, requestKey) {
  await httpClient(`/api/cases/${encodeURIComponent(caseId)}/runs`, {
    method: 'POST',
    data: { requirement, requestKey },
  });
}
