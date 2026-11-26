import {
  ConceptBadge, ConceptCard, ConceptLink, ConceptPage,
} from '@/components/ui/ConceptLayout';
import EmailDraftEditor from '@/features/cases/components/EmailDraftEditor';

const DRAFT_PATH = '/cases/detail/email-draft';
const PREVIEW_STEPS = {
  generated: { title: 'AI 생성 완료', description: 'AI가 초안을 수정한 상태의 화면입니다.' },
  saved: { title: '초안 저장 완료', description: '수정한 초안을 저장한 뒤의 화면입니다.' },
  approve: { title: '이 초안의 발송을 승인할까요?',
    description: '수신자·영문 제목·본문·첨부파일을 확인해 주세요.' },
  sending: { title: 'Gmail로 발송하고 있어요',
    description: '승인한 최신 초안의 발송 결과를 확인하는 화면입니다.' },
  sent: { title: '최신 이메일을 발송했어요',
    description: '발송 결과와 발송된 초안을 확인하는 화면입니다.' },
};

export default async function EmailDraftPage({ searchParams }) {
  const { draftId, step } = await searchParams;

  if (typeof draftId === 'string' && /^[1-9]\d{0,18}$/.test(draftId)) {
    return (
      <ConceptPage title="이메일 초안 작성·발송"
        action={<ConceptLink href="/cases">← 내 사건</ConceptLink>}>
        <EmailDraftEditor key={draftId} draftId={draftId} />
      </ConceptPage>
    );
  }
  if (draftId !== undefined) {
    return (
      <ConceptPage title="이메일 초안을 찾을 수 없어요"
        action={<ConceptLink href="/cases">← 내 사건</ConceptLink>} />
    );
  }

  const preview = Object.hasOwn(PREVIEW_STEPS, step) ? PREVIEW_STEPS[step] : null;

  if (preview) {
    return (
      <ConceptPage title={preview.title} description={preview.description}
        action={<ConceptLink href={DRAFT_PATH}>← 이메일 작업</ConceptLink>}>
        <div className="mb-5">
          <ConceptBadge tone="accent">미리보기 · 실제 이메일은 발송되지 않습니다</ConceptBadge>
        </div>
        <ConceptCard title="영문 이메일 초안">
          <p className="text-sm text-gre-muted">받는 사람 · support@merchant.example</p>
          <p className="mt-2 font-semibold">Request for Refund Status Update</p>
          <p className="mt-2 text-sm text-gre-muted">첨부 · 주문 확인서 / 결제 내역</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {step === 'approve' && (
              <ConceptLink href={`${DRAFT_PATH}?step=sending`} primary>승인하고 발송</ConceptLink>
            )}
            {step === 'sending' && (
              <ConceptLink href={`${DRAFT_PATH}?step=sent`} primary>발송 결과 확인</ConceptLink>
            )}
            {step === 'sent' && (
              <ConceptLink href="/cases/detail" primary>사건 상세로 돌아가기</ConceptLink>
            )}
            {['generated', 'saved'].includes(step) && (
              <ConceptLink href={DRAFT_PATH} primary>초안으로 돌아가기</ConceptLink>
            )}
            {step === 'approve' && <ConceptLink href={DRAFT_PATH}>취소</ConceptLink>}
          </div>
        </ConceptCard>
      </ConceptPage>
    );
  }

  return (
    <ConceptPage title="이메일 초안 작성·수정"
      description="해외 주문 환불 지연 · support@merchant.example"
      action={<ConceptLink href="/cases/detail">← 사건 상세</ConceptLink>}>
      <div className="mb-5"><ConceptBadge>DRAFT · revision 3 · 예시</ConceptBadge></div>
      <div className="grid items-start gap-6 @4xl:grid-cols-[0.85fr_1.15fr]">
        <ConceptCard title="AI와 이메일 다듬기">
          <p className="text-sm text-gre-muted">작성 대화는 실제 판매자 메일과 별도로 보관됩니다.</p>
          <div className="mt-4 rounded-xl bg-gre-canvas p-4 text-sm">
            <p className="mb-2 text-xs text-gre-muted">나</p>
            환불 진행 상황을 정중하게 재확인하는 메일로 수정해 줘.
          </div>
          <div className="mt-3 rounded-xl bg-gre-selection p-4 text-sm">
            <p className="mb-2 text-xs font-semibold text-gre-accent">GRE 작성 AI</p>
            확인된 주문 정보와 정책 근거를 유지하며 정중한 표현으로 수정했습니다.
          </div>
          <label className="gre-label mt-4">수정할 내용을 입력하세요.
            <textarea className="gre-field min-h-24" placeholder="예: 답변 희망일을 추가해 줘" />
          </label>
          <div className="mt-3">
            <ConceptLink href={`${DRAFT_PATH}?step=generated`} primary>수정 요청 보내기 ↑</ConceptLink>
          </div>
        </ConceptCard>
        <ConceptCard title="최신 영문 이메일">
          <label className="gre-label">받는 사람<input className="gre-field" type="email"
            defaultValue="support@merchant.example" /></label>
          <label className="gre-label mt-4">제목<input className="gre-field"
            defaultValue="Request for Refund Status Update" /></label>
          <label className="gre-label mt-4">본문<textarea lang="en" rows={9} className="gre-field"
            defaultValue={`Dear Customer Support Team,

I am following up regarding the refund for my recent order.

Could you please confirm the current processing status and expected refund date?

Thank you for your assistance.

Best regards,`} /></label>
          <p className="mt-3 text-xs text-gre-muted">첨부파일 · 주문 확인서 / 결제 내역</p>
          <div className="mt-4"><ConceptLink href={`${DRAFT_PATH}?step=saved`}>초안 저장</ConceptLink></div>
          <div className="mt-4 rounded-xl bg-gre-selection p-4">
            <p className="font-semibold">발송 전 최종 확인</p>
            <p className="mt-2 text-sm text-gre-muted">현재는 이메일 작업 화면의 디자인 미리보기입니다.</p>
            <div className="mt-3">
              <ConceptLink href={`${DRAFT_PATH}?step=approve`} primary>이 초안의 발송 승인</ConceptLink>
            </div>
          </div>
        </ConceptCard>
      </div>
    </ConceptPage>
  );
}
