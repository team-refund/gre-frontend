'use client';

import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { ConceptCard, ConceptLink } from '@/components/ui/ConceptLayout';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { getRefundDraft, getServerRefundDraft, setRefundDraft, subscribeToRefundDraft }
  from '@/features/home/refundDraft';
import { createCase } from './api/caseRegistrationApi';

const TYPES = [
  ['REFUND_DELAY', '환불 지연'],
  ['REFUND_NOT_PROCESSED', '환불 미처리'],
  ['DUPLICATE_CHARGE', '중복 결제'],
  ['PAYMENT_CORRECTION', '결제 정정'],
];

export default function CaseRegistration() {
  const router = useRouter();
  const draft = useSyncExternalStore(subscribeToRefundDraft, getRefundDraft, getServerRefundDraft);
  const [type, setType] = useState(TYPES[0][0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResultUnknown, setIsResultUnknown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting || isResultUnknown) return;

    const values = new FormData(event.currentTarget);
    const readValue = (name) => String(values.get(name) ?? '').trim();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const caseId = await createCase({
        caseType: type,
        merchantName: readValue('seller'),
        merchantEmail: readValue('merchantEmail'),
        purchaseSite: readValue('site'),
        orderNumber: readValue('orderNumber'),
        purchaseDate: readValue('date'),
        paymentAmount: readValue('amount'),
        requirement: readValue('description'),
      });
      router.push(`/cases/detail?id=${caseId}`);
      setRefundDraft(null);
    } catch (error) {
      const isUnconfirmed = !error?.status || error.status >= 500;
      setIsResultUnknown(isUnconfirmed);
      setErrorMessage(isUnconfirmed
        ? '등록 결과를 확인하지 못했어요. 다시 등록하기 전에 내 사건 목록을 확인해 주세요.'
        : getApiErrorMessage(error, '사건을 등록하지 못했어요.'));
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}
        className="grid items-start gap-6 @4xl:grid-cols-[1.65fr_1fr]">
        <ConceptCard title="01 사건 정보">
          <fieldset className="mb-4">
            <legend className="mb-2 text-sm font-semibold">지원 분쟁 유형</legend>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(([value, label]) => (
                <button key={value} type="button" aria-pressed={type === value}
                  onClick={() => setType(value)}
                  className={type === value ? 'gre-button bg-gre-selection text-gre-accent' :
                    'gre-button'}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 @xl:grid-cols-2">
            <label className="gre-label">판매자 *<input className="gre-field" name="seller" required
              maxLength={255} defaultValue={draft?.seller} placeholder="판매자 이름" /></label>
            <label className="gre-label">판매자 이메일 *
              <input className="gre-field" name="merchantEmail" type="email" required
                maxLength={255} defaultValue={draft?.merchantEmail}
                placeholder="support@example.com" />
            </label>
            <label className="gre-label">구매 사이트 *<input className="gre-field" name="site" required
              type="url" maxLength={500} defaultValue={draft?.site} placeholder="https://" /></label>
            <label className="gre-label">주문번호 *
              <input className="gre-field" name="orderNumber" required
                maxLength={100} defaultValue={draft?.orderNumber} placeholder="주문번호를 입력하세요" />
            </label>
            <label className="gre-label">구매일 *<input className="gre-field" name="date" required
              type="date" defaultValue={draft?.date} /></label>
            <label className="gre-label">결제금액 (KRW) *
              <input className="gre-field" name="amount" required min="1" max="9999999999999.99"
                step="0.01" type="number"
                defaultValue={draft?.amount} placeholder="금액을 원 단위로 입력하세요" />
            </label>
            <label className="gre-label @xl:col-span-2">사건 설명 및 요청사항 *
              <textarea className="gre-field min-h-28" name="description" required maxLength={10000}
                key={draft?.description ?? ''} defaultValue={draft?.description}
                placeholder="어떤 문제가 있었고 어떤 해결을 원하시나요?" />
            </label>
          </div>
          <p className="mt-3 text-xs text-gre-muted">* 필수 항목을 확인해 주세요.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="gre-button gre-button-primary" type="submit"
              disabled={isSubmitting || isResultUnknown}>
              {isSubmitting ? '등록 중…' : '사건 저장 및 AI 분석 시작'}
            </button>
            <ConceptLink href="/">취소</ConceptLink>
          </div>
          {errorMessage && <p role="alert" className="mt-3 text-sm text-red-700">{errorMessage}</p>}
          {isResultUnknown && <ConceptLink href="/cases">내 사건 확인</ConceptLink>}
        </ConceptCard>
        <ConceptCard title="02 증빙 첨부">
          <p className="text-sm text-gre-muted">증빙 업로드는 아직 준비 중이에요.</p>
          {draft?.files?.length > 0 && (
            <p className="mt-2 text-sm">미리 선택한 파일 {draft.files.length}개는 사건 등록에 포함되지 않아요.</p>
          )}
          <p className="mt-4 text-sm font-semibold">공식 정책 원문은 직접 올리지 않아도 돼요.</p>
          <div className="mt-4 rounded-xl bg-gre-canvas p-4">
            <p className="text-sm font-semibold">제출 전 확인</p>
            <p className="mt-2 text-xs text-gre-muted">불필요한 개인정보는 가려주세요.</p>
          </div>
        </ConceptCard>
      </form>
    </>
  );
}
