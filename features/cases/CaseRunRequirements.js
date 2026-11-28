'use client';

import { useState, useSyncExternalStore } from 'react';
import ChatComposer from '@/components/ui/ChatComposer';
import { EVIDENCE_PHOTO_ACCEPT, selectEvidencePhotos } from './evidencePhotos';
import RunFollowUpChat from './RunFollowUpChat';
import { getLatestRun, saveLatestRun, subscribeToRegisteredCases } from './registeredCases';

const getServerRun = () => null;

export default function CaseRunRequirements({ item, isExample }) {
  const latestRun = useSyncExternalStore(
    subscribeToRegisteredCases, () => getLatestRun(item.id), getServerRun,
  );
  const [draft, setDraft] = useState(null);
  const requirement = latestRun?.requirement ?? item.requirement;
  const attachments = latestRun?.attachments ?? item.files ?? [];
  const runNumber = latestRun?.number ?? (isExample ? 2 : 1);
  const hasExampleResult = !latestRun && isExample;
  const canSave = Boolean(draft?.requirement.trim()) && (
    draft.requirement.trim() !== requirement.trim() ||
    draft.attachments.length !== attachments.length ||
    draft.attachments.some((entry, index) => entry.file !== attachments[index])
  );

  function handleEdit() {
    setDraft({
      requirement,
      attachments: attachments.map((file) => ({ id: crypto.randomUUID(), file })),
    });
  }

  function handleAttach(event) {
    const photos = selectEvidencePhotos(event.target.files);
    event.target.value = '';
    if (!photos.length) return;

    const attachments = photos.map((file) => ({ id: crypto.randomUUID(), file }));
    setDraft((current) => ({ ...current, attachments: [...current.attachments, ...attachments] }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSave) return;

    saveLatestRun(item.id, {
      number: runNumber + 1,
      requirement: draft.requirement.trim(),
      attachments: draft.attachments.map(({ file }) => file),
    });
    setDraft(null);
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing ||
        event.keyCode === 229) return;

    event.preventDefault();
    if (canSave) event.currentTarget.form.requestSubmit();
  }

  return (
    <>
      {draft ? (
        <form onSubmit={handleSubmit}>
          <ChatComposer
            inputLabel="사용자 요구사항 수정"
            placeholder="AI에게 요청할 내용을 입력하세요."
            value={draft.requirement}
            onChange={(event) => setDraft({ ...draft, requirement: event.target.value })}
            onKeyDown={handleKeyDown}
            attachmentCount={draft.attachments.length}
            attachmentAccept={EVIDENCE_PHOTO_ACCEPT}
            onAttach={handleAttach}
            actionLabel="요구사항 저장 및 새 Run 등록"
            disabled={!canSave}
          >
            {draft.attachments.length > 0 && (
              <ul aria-label="첨부할 파일" className="flex flex-wrap gap-2">
                {draft.attachments.map(({ id, file }) => (
                  <li key={id} className="flex max-w-full items-center gap-2 rounded-lg
                    bg-gre-canvas px-3 py-2 text-sm">
                    <span className="min-w-0 wrap-anywhere">{file.name}</span>
                    <button
                      type="button"
                      aria-label={`${file.name} 첨부 삭제`}
                      className="shrink-0 text-gre-muted hover:text-gre-text"
                      onClick={() => setDraft((current) => ({
                        ...current,
                        attachments: current.attachments.filter((entry) => entry.id !== id),
                      }))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ChatComposer>
          <button type="button" className="gre-button mt-3" onClick={() => setDraft(null)}>
            취소
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-gre-border bg-gre-canvas p-4">
          <p className="whitespace-pre-wrap wrap-anywhere text-sm leading-6">{requirement}</p>
          {attachments.length > 0 && (
            <ul aria-label="첨부 파일" className="mt-2 space-y-1 text-sm text-gre-muted">
              {attachments.map((file, index) => (
                <li key={`${file.name}-${index}`} className="wrap-anywhere">{file.name}</li>
              ))}
            </ul>
          )}
          <button type="button" className="gre-button mt-3" onClick={handleEdit}>
            요구사항 수정
          </button>
        </div>
      )}
      <section className="mt-6 border-t border-gre-border pt-4" aria-live="polite">
        <h3 className="text-lg font-bold">AI Run {String(runNumber).padStart(2, '0')}</h3>
        {hasExampleResult ? (
          <div className="mt-2 text-sm leading-6">
            <p className="font-semibold">후속 대응 검토 완료</p>
            <p className="mt-2">확인된 자료를 바탕으로 다음 대응을 준비했습니다.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>증빙 검토 AI · 주문 확인서와 결제 내역 확인</li>
              <li>정책 검토 AI · 판매자 환불 정책 확인</li>
            </ul>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gre-muted">예시 등록 완료</p>
        )}
      </section>
      {hasExampleResult && item.followUpQuestion && (
        <RunFollowUpChat
          key={runNumber}
          runId={`${item.id}:${runNumber}`}
          question={item.followUpQuestion}
          previousExchange={item.followUpExchange}
        />
      )}
    </>
  );
}
