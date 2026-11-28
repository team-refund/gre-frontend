import { cookies } from 'next/headers';

import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { httpClient } from '@/lib/api/httpClient';
import { HttpError } from '@/lib/api/httpError';

const CASE_LOAD_FAILED = '사건을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
const EVIDENCE_LOAD_FAILED = '증빙 자료를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';

const EMAIL_MESSAGES_LOAD_FAILED = '이메일 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
const EMAIL_MESSAGE_LOAD_FAILED = '이메일을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';

function caseLoadError(status, error, fallback, notFoundMessage) {
  if (status === 401) return '마이페이지에서 로그인한 뒤 다시 확인해 주세요.';
  if (status === 403) return '사건을 조회할 권한이 없어요.';
  if (status === 404) return notFoundMessage ?? '사건을 찾을 수 없어요.';
  return getApiErrorMessage(error, fallback);
}

async function getCaseResource(path, params, fallback = CASE_LOAD_FAILED, notFoundMessage) {
  const session = (await cookies()).get('JSESSIONID')?.value;
  if (!session) return { errorMessage: caseLoadError(401) };
  if (!process.env.API_BASE_URL) return { errorMessage: fallback };

  try {
    const { status, data } = await httpClient(new URL(path, process.env.API_BASE_URL).href, {
      method: 'GET',
      params,
      headers: { Cookie: `JSESSIONID=${encodeURIComponent(session)}` },
      maxRedirects: 0,
      timeout: 10000,
    });
    return status === 200 ? { data } : { errorMessage: fallback };
  } catch (error) {
    const status = error instanceof HttpError ? error.status : undefined;
    return { errorMessage: caseLoadError(status, error, fallback, notFoundMessage) };
  }
}

export async function getCases(page) {
  const result = await getCaseResource('/api/cases', { page, size: 20 });
  if (result.errorMessage) return result;

  const { data } = result;
  if (!Array.isArray(data?.cases) || !Number.isInteger(data.size) || data.size < 1
    || !Number.isInteger(data.totalElements) || data.totalElements < 0) {
    return { errorMessage: CASE_LOAD_FAILED };
  }
  return result;
}

export async function getCase(id) {
  const result = await getCaseResource(`/api/cases/${encodeURIComponent(id)}`);
  if (result.errorMessage) return result;
  return typeof result.data?.title === 'string' ? result : { errorMessage: CASE_LOAD_FAILED };
}

export async function getCaseEvidences(id) {
  const path = `/api/cases/${encodeURIComponent(id)}/evidences`;
  const result = await getCaseResource(path, undefined, EVIDENCE_LOAD_FAILED);
  if (result.errorMessage || Array.isArray(result.data)) return result;
  return { errorMessage: EVIDENCE_LOAD_FAILED };
}

export async function getCaseEmailMessages(caseId, page = 0) {
  const path = `/api/cases/${encodeURIComponent(caseId)}/email-messages`;
  const result = await getCaseResource(path, { page, size: 20 }, EMAIL_MESSAGES_LOAD_FAILED);
  if (result.errorMessage) return result;
  const { data } = result;
  if (!Array.isArray(data?.items) || !Number.isInteger(data.size) || data.size < 1
    || !Number.isInteger(data.total) || data.total < 0) {
    return { errorMessage: EMAIL_MESSAGES_LOAD_FAILED };
  }
  return result;
}

export async function getCaseEmailMessage(caseId, messageId) {
  const path = `/api/cases/${encodeURIComponent(caseId)}/email-messages/${encodeURIComponent(messageId)}`;
  const result = await getCaseResource(
    path, undefined, EMAIL_MESSAGE_LOAD_FAILED, '이메일을 찾을 수 없어요.',
  );
  if (result.errorMessage || String(result.data?.messageId) === messageId) return result;
  return { errorMessage: EMAIL_MESSAGE_LOAD_FAILED };
}
