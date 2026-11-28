import { ConceptBadge } from '@/components/ui/ConceptLayout';

const EVIDENCE_TYPES = {
  ORDER_CONFIRMATION: '주문 확인서',
  PAYMENT_RECORD: '결제 내역',
  REFUND_RECORD: '환불 내역',
  SCREENSHOT: '화면 캡처',
  PHOTO: '사진',
  CONVERSATION: '대화 내역',
  OTHER: '기타',
};

const ANALYSIS_STATUS = {
  PENDING: '대기 중',
  PROCESSING: '분석 중',
  COMPLETED: '분석 완료',
  FAILED: '분석 실패',
};

export default function CaseEvidenceList({ evidences }) {
  if (!evidences.length) {
    return <p className="text-sm text-gre-muted">등록된 증빙 자료가 없어요.</p>;
  }

  return (
    <ul className="divide-y divide-gre-border text-sm">
      {evidences.map((evidence) => (
        <li key={evidence.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="wrap-anywhere font-semibold">{evidence.originalFilename}</p>
            <p className="mt-1 text-gre-muted">
              {Object.hasOwn(EVIDENCE_TYPES, evidence.evidenceType)
                ? EVIDENCE_TYPES[evidence.evidenceType]
                : '유형 확인 필요'}
            </p>
            {evidence.description && (
              <p className="mt-1 whitespace-pre-wrap wrap-anywhere">{evidence.description}</p>
            )}
          </div>
          <ConceptBadge tone={evidence.analysisStatus === 'COMPLETED' ? 'success' : 'neutral'}>
            {Object.hasOwn(ANALYSIS_STATUS, evidence.analysisStatus)
              ? ANALYSIS_STATUS[evidence.analysisStatus]
              : '상태 확인 필요'}
          </ConceptBadge>
        </li>
      ))}
    </ul>
  );
}
