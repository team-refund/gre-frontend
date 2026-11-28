import { HttpError } from './httpError';

const STATUS_MESSAGES = {
  400: '입력 내용을 확인해 주세요.',
  401: '다시 로그인한 뒤 시도해 주세요.',
  403: '이 작업을 수행할 권한이 없어요.',
  404: '요청한 정보를 찾을 수 없어요.',
  409: '정보가 변경되었어요. 최신 상태를 확인해 주세요.',
  429: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.',
  502: '서버와 연결할 수 없어요. 잠시 후 다시 시도해 주세요.',
  503: '서비스를 이용할 수 없어요. 잠시 후 다시 시도해 주세요.',
};

export function getApiErrorMessage(error, fallback = '요청을 처리하지 못했어요.') {
  if (error instanceof HttpError) {
    return STATUS_MESSAGES[error.status] ?? fallback;
  }

  if (error?.code === 'ERR_NETWORK' || error?.code === 'ECONNABORTED'
    || error?.code === 'ETIMEDOUT') {
    return '서버 응답을 확인하지 못했어요. 네트워크 상태를 확인해 주세요.';
  }

  return fallback;
}
