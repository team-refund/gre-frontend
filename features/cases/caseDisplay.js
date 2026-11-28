const STATUS_LABELS = {
  REGISTERED: '등록됨',
  ANALYZING: '분석 중',
  NEED_USER_INFO: '추가 정보 입력 대기',
  WAITING_APPROVAL: '승인 대기',
  IN_PROGRESS: '대응 중',
  RESOLVED: '해결됨',
  CLOSED: '종료',
};

export function getCaseStatusLabel(status) {
  return Object.hasOwn(STATUS_LABELS, status) ? STATUS_LABELS[status] : '상태 확인 필요';
}

export function toCaseListItem(item) {
  const isFinished = item.status === 'CLOSED' || item.status === 'RESOLVED';
  return {
    id: String(item.id),
    name: item.title,
    status: getCaseStatusLabel(item.status),
    tone: isFinished ? 'success' : 'neutral',
    group: isFinished ? 'closed' : 'active',
    next: '—',
  };
}
