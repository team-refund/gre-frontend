'use client';

import { useEffect, useState } from 'react';

import { ConceptBadge, ConceptCard, ConceptLink } from '@/components/ui/ConceptLayout';
import { gmailErrorMessage } from '@/features/gmail/api/gmailApi';

import {
  approveEmailDraft, getEmailDraft, getEmailSendAttempts, sendEmailDraft, updateEmailDraft,
} from '../api/emailDraftApi';

const SEND_STATUS = {
  SENDING: '발송 중이에요. 잠시 뒤 상태를 다시 확인해 주세요.',
  SENT: 'Gmail로 이메일을 발송했어요.',
  FAILED: '이메일이 발송되지 않았어요. Gmail 연결과 초안 내용을 확인해 주세요.',
  UNKNOWN: '발송 결과를 확인할 수 없어요. Gmail 보낸편지함을 확인해 주세요.',
};

export default function EmailDraftEditor({ draftId }) {
  const [draft, setDraft] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSendUnconfirmed, setIsSendUnconfirmed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getEmailDraft(draftId, controller.signal),
      getEmailSendAttempts(draftId, controller.signal),
    ]).then(([details, attempts]) => {
      if (controller.signal.aborted) return;
      setDraft(details);
      setAttempt(attempts[0] ?? null);
    }).catch((failure) => {
      if (!controller.signal.aborted) {
        setError(gmailErrorMessage(failure, '이메일 초안을 불러오지 못했어요.'));
      }
    });
    return () => controller.abort();
  }, [draftId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setNotice('');
    setDraft((current) => ({ ...current, [name]: value }));
  }

  async function handleDraftSubmit(event) {
    event.preventDefault();
    if (!canEdit || action) return;

    const shouldApprove = event.nativeEvent.submitter?.value === 'approve';
    setAction(shouldApprove ? 'approve' : 'save');
    setError('');
    setNotice('');
    try {
      const content = { to: draft.to.trim(), subject: draft.subject.trim(), body: draft.body };
      if (shouldApprove) {
        const approved = await approveEmailDraft(draftId, content);
        setDraft((current) => ({ ...current, ...content, status: approved.status }));
      } else {
        setDraft(await updateEmailDraft(draftId, content));
        setNotice('초안을 저장했어요.');
      }
    } catch (failure) {
      const fallback = shouldApprove ? '이메일 초안을 승인하지 못했어요.' : '초안을 저장하지 못했어요.';
      setError(gmailErrorMessage(failure, fallback));
    } finally {
      setAction('');
    }
  }

  async function handleSend() {
    setAction('send');
    setError('');
    try {
      const result = await sendEmailDraft(draftId, window.crypto.randomUUID());
      setAttempt(result);
    } catch (failure) {
      if (!failure?.status || failure.status >= 500 || failure.action === 'CHECK_SEND_STATUS') {
        setIsSendUnconfirmed(true);
        setError('발송 결과를 확인하지 못했어요. 다시 보내기 전에 발송 상태를 확인해 주세요.');
      } else {
        setError(gmailErrorMessage(failure, '이메일을 발송하지 못했어요.'));
      }
    } finally {
      setAction('');
    }
  }

  async function handleCheckStatus() {
    setAction('check');
    setError('');
    try {
      const attempts = await getEmailSendAttempts(draftId);
      setAttempt(attempts[0] ?? null);
      if (attempts.length > 0) setIsSendUnconfirmed(false);
    } catch (failure) {
      setError(gmailErrorMessage(failure, '발송 상태를 확인하지 못했어요.'));
    } finally {
      setAction('');
    }
  }

  const canEdit = draft?.status === 'DRAFT' && !attempt && !isSendUnconfirmed;
  const canSend = draft?.status === 'FINALIZED' && !attempt && !isSendUnconfirmed;
  const displayStatus = attempt?.status === 'SENT' ? 'SENT' : draft?.status;

  return (
    <ConceptCard title="이메일 초안">
      {!draft && !error && <p role="status">초안을 불러오는 중이에요.</p>}
      {draft && (
        <>
          <ConceptBadge tone={displayStatus === 'SENT' ? 'success' : 'neutral'}>
            {displayStatus}
          </ConceptBadge>
          <form className="mt-4 grid gap-4" onSubmit={handleDraftSubmit}>
            <fieldset disabled={!canEdit || Boolean(action)} className="grid min-w-0 gap-4">
              <label className="gre-label">
                받는 사람
                <input className="gre-field" name="to" type="email" required maxLength={255}
                  value={draft.to ?? ''} onChange={handleChange} />
              </label>
              <label className="gre-label">
                제목
                <input className="gre-field" name="subject" required maxLength={255}
                  value={draft.subject ?? ''} onChange={handleChange} />
              </label>
              <label className="gre-label">
                본문
                <textarea className="gre-field" name="body" required rows={10} maxLength={20000}
                  value={draft.body ?? ''} onChange={handleChange} />
              </label>
            </fieldset>
            {draft.attachmentEvidenceIds?.length > 0 && (
              <p className="text-sm text-gre-muted">첨부 증빙 {draft.attachmentEvidenceIds.length}개</p>
            )}
            {(canEdit || canSend) && (
              <div className="flex flex-wrap gap-2">
                {canSend ? (
                  <button type="button" className="gre-button gre-button-primary"
                    disabled={Boolean(action)} onClick={handleSend}>
                    {action === 'send' ? '발송 요청 중…' : 'Gmail로 발송'}
                  </button>
                ) : (
                  <>
                    <button type="submit" value="save" className="gre-button"
                      disabled={Boolean(action)}>
                      {action === 'save' ? '저장 중…' : '초안 저장'}
                    </button>
                    <button type="submit" value="approve" className="gre-button gre-button-primary"
                      disabled={Boolean(action)}>
                      {action === 'approve' ? '승인 중…' : '초안 승인'}
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
          {canSend && (
            <p role="status" className="mt-3 text-sm">초안이 승인되었어요. 내용을 확인하고 발송해 주세요.</p>
          )}
          {attempt && (
            <p role="status" className="mt-3 text-sm">{SEND_STATUS[attempt.status]}</p>
          )}
          {(isSendUnconfirmed || ['SENDING', 'UNKNOWN'].includes(attempt?.status)) && (
            <button type="button" className="gre-button mt-3" disabled={Boolean(action)}
              onClick={handleCheckStatus}>
              {action === 'check' ? '확인 중…' : '발송 상태 확인'}
            </button>
          )}
        </>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mt-3 text-sm">{notice}</p>}
      <div className="mt-4">
        <ConceptLink href="/me/gmail-connections">Gmail 연결 관리</ConceptLink>
      </div>
    </ConceptCard>
  );
}
