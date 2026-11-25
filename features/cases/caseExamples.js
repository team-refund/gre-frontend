export const CASE_EXAMPLES = [
  { id: 'CASE-2026-001', name: '해외 주문 환불 지연', status: '승인 필요', tone: 'approval',
    group: 'active', next: '이메일 초안 v3' },
  { id: 'CASE-2026-002', name: '중복 결제', status: '회신 대기', tone: 'neutral',
    group: 'active', next: '판매자 이메일 회신 대기' },
  { id: 'CASE-2026-003', name: '결제 정정', status: '환불 확인 대기', tone: 'success',
    group: 'refund', next: '판매자 환불 처리 통보' },
  { id: 'CASE-2026-004', name: '환불 지연', status: '종료', tone: 'success',
    group: 'closed', next: '사용자가 실제 환불 확인' },
  { id: 'CASE-2026-005', name: '결제 정정', status: '종료', tone: 'success',
    group: 'closed', next: '사건 처리 완료' },
];
