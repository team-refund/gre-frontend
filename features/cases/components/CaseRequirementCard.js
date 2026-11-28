'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';

import { submitCaseRequirement } from '../api/caseRequirementApi';

const MAX_REQUIREMENT_LENGTH = 10_000;

export default function CaseRequirementCard({ caseId, requirement, canEdit }) {
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const displayedRequirement = requirement ?? '';
  const text = draft?.trim();
  const canSubmit = canEdit && Boolean(text) && text !== displayedRequirement.trim()
    && text.length <= MAX_REQUIREMENT_LENGTH && !isSubmitting;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    const requestKey = submission?.text === text ? submission.requestKey : crypto.randomUUID();
    setSubmission({ text, requestKey });
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await submitCaseRequirement(caseId, text, requestKey);
      setSubmission(null);
      setDraft(null);
      router.refresh();
    } catch (error) {
      setErrorMessage(error?.code === 'CASE_REQUIREMENT_CONFLICT'
        ? '요구사항을 수정할 수 없어요. 최신 사건 상태를 확인해 주세요.'
        : getApiErrorMessage(error, '분석 요청 결과를 확인하지 못했어요.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {draft === null ? (
        <div>
          <p className="whitespace-pre-wrap wrap-anywhere text-sm leading-6">
            {displayedRequirement || '등록된 요구사항이 없어요.'}
          </p>
          {canEdit && (
            <button type="button" className="gre-button mt-3"
              onClick={() => setDraft(displayedRequirement)}>
              {displayedRequirement ? '요구사항 수정' : '요구사항 입력'}
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-3">
          <textarea
            aria-label="사용자 요구사항"
            className="gre-field"
            rows={4}
            required
            maxLength={MAX_REQUIREMENT_LENGTH}
            value={draft}
            disabled={isSubmitting}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="gre-button gre-button-primary" disabled={!canSubmit}>
              {isSubmitting ? '분석 요청 중…' : '저장하고 분석 요청'}
            </button>
            <button type="button" className="gre-button" disabled={isSubmitting}
              onClick={() => { setDraft(null); setErrorMessage(''); }}>
              취소
            </button>
          </div>
          {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
        </form>
      )}
    </>
  );
}
