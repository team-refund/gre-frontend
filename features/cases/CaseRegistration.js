'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useSyncExternalStore } from 'react';
import { ConceptCard, ConceptLink } from '@/components/ui/ConceptLayout';
import { getRefundDraft, getServerRefundDraft, setRefundDraft, subscribeToRefundDraft }
  from '@/features/home/refundDraft';
import { registerCase } from './registeredCases';
import { EVIDENCE_PHOTO_ACCEPT, selectEvidencePhotos } from './evidencePhotos';

const TYPES = ['환불 지연', '상품 미배송', '중복 결제', '상품 불량'];

export default function CaseRegistration() {
  const router = useRouter();
  const draft = useSyncExternalStore(subscribeToRefundDraft, getRefundDraft, getServerRefundDraft);
  const formRef = useRef(null);
  const [type, setType] = useState(TYPES[0]);
  const [files, setFiles] = useState(null);
  const [hasInvalidAttachment, setHasInvalidAttachment] = useState(false);
  const attachments = files ?? selectEvidencePhotos(draft?.files ?? []);

  function handleAttach(event) {
    const { files: selectedFiles } = event.currentTarget;
    const photos = selectEvidencePhotos(selectedFiles);
    setHasInvalidAttachment(photos.length !== selectedFiles.length);
    setFiles(photos);
    if (photos.length !== selectedFiles.length) event.currentTarget.value = '';
  }

  function handleSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(formRef.current));
    const submittedDraft = { ...values, type, files: attachments };
    setRefundDraft(submittedDraft);
    const id = registerCase(submittedDraft);
    router.push(`/cases/register?step=processing&id=${id}`);
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}
        className="grid items-start gap-6 @4xl:grid-cols-[1.65fr_1fr]">
        <ConceptCard title="01 사건 정보">
          <fieldset className="mb-4">
            <legend className="mb-2 text-sm font-semibold">지원 분쟁 유형</legend>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((label) => (
                <button key={label} type="button" aria-pressed={type === label}
                  onClick={() => setType(label)}
                  className={type === label ? 'gre-button bg-gre-selection text-gre-accent' :
                    'gre-button'}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 @xl:grid-cols-2">
            <label className="gre-label">판매자 *<input className="gre-field" name="seller" required
              defaultValue={draft?.seller} placeholder="판매자 이름" /></label>
            <label className="gre-label">판매자 이메일 *
              <input className="gre-field" name="merchantEmail" type="email" required
                maxLength={255} defaultValue={draft?.merchantEmail}
                placeholder="support@example.com" />
            </label>
            <label className="gre-label">구매 사이트 *<input className="gre-field" name="site" required
              type="url" defaultValue={draft?.site} placeholder="https://" /></label>
            <label className="gre-label">주문번호 *
              <input className="gre-field" name="orderNumber" required
                defaultValue={draft?.orderNumber} placeholder="주문번호를 입력하세요" />
            </label>
            <label className="gre-label">구매일 *<input className="gre-field" name="date" required
              type="date" defaultValue={draft?.date} /></label>
            <label className="gre-label">결제금액 (KRW) *
              <input className="gre-field" name="amount" required min="1" type="number"
                defaultValue={draft?.amount} placeholder="금액을 원 단위로 입력하세요" />
            </label>
            <label className="gre-label @xl:col-span-2">사건 설명 및 요청사항 *
              <textarea className="gre-field min-h-28" name="description" required
                key={draft?.description ?? ''} defaultValue={draft?.description}
                placeholder="어떤 문제가 있었고 어떤 해결을 원하시나요?" />
            </label>
          </div>
          <p className="mt-3 text-xs text-gre-muted">* 필수 항목을 확인해 주세요.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="gre-button gre-button-primary" type="submit">
              사건 저장 및 AI 분석 시작
            </button>
            <ConceptLink href="/">취소</ConceptLink>
          </div>
          <p className="mt-3 text-xs text-gre-muted">화면 미리보기 · 입력은 현재 탭에만 보관합니다.</p>
        </ConceptCard>
        <ConceptCard title="02 증빙 첨부">
          <p className="text-sm text-gre-muted">주문 확인서·결제 내역·판매자 대화의 사진이나 캡처를 첨부하세요.</p>
          <label className="mt-4 grid cursor-pointer gap-2 rounded-xl border border-dashed
            border-gre-border bg-gre-canvas p-5 text-sm font-semibold
            focus-within:outline-2 focus-within:outline-gre-accent">
            <input type="file" className="sr-only" multiple accept={EVIDENCE_PHOTO_ACCEPT}
              onChange={handleAttach} />
            ＋ 사진 추가
            <span className="text-xs font-normal text-gre-muted">JPG · PNG · WebP · HEIC · HEIF · AVIF</span>
          </label>
          {hasInvalidAttachment && (
            <p role="alert" className="mt-2 text-sm text-red-700">증빙은 사진 파일만 첨부할 수 있습니다.</p>
          )}
          {attachments.length > 0 && (
            <ul className="mt-3 space-y-1 break-all text-sm text-gre-muted">
              {attachments.map((file, i) => <li key={`${file.name}-${i}`}>{file.name}</li>)}
            </ul>
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
