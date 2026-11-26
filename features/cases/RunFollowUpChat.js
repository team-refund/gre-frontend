'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import ChatComposer from '@/components/ui/ChatComposer';
import { EVIDENCE_PHOTO_ACCEPT, selectEvidencePhotos } from './evidencePhotos';
import { addRunReply, getRunReplies, subscribeToRegisteredCases } from './registeredCases';

const EMPTY_REPLIES = [];
const getServerReplies = () => EMPTY_REPLIES;

export default function RunFollowUpChat({ runId, question, previousExchange }) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const replies = useSyncExternalStore(
    subscribeToRegisteredCases, () => getRunReplies(runId), getServerReplies,
  );
  const logRef = useRef(null);
  const canSend = Boolean(message.trim() || files.length);

  useEffect(() => {
    const log = logRef.current;
    log.scrollTop = log.scrollHeight;
  }, [replies]);

  function handleAttach(event) {
    const photos = selectEvidencePhotos(event.target.files);
    event.target.value = '';
    if (photos.length) setFiles(photos);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSend) return;

    addRunReply(runId, {
      id: crypto.randomUUID(),
      message: message.trim(),
      files,
    });
    setMessage('');
    setFiles([]);
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing ||
        event.keyCode === 229) return;

    event.preventDefault();
    if (canSend) event.currentTarget.form.requestSubmit();
  }

  return (
    <section className="mt-5 border-t border-gre-border pt-4" aria-label="지휘자와의 대화">
      <div ref={logRef} role="log" aria-label="추가 정보 요청과 답변" tabIndex={0}
        className="max-h-[min(24rem,45dvh)] space-y-4 overflow-y-auto overscroll-y-contain
          px-1 text-sm leading-6">
        {previousExchange && (
          <>
            <div className="max-w-prose">
              <p className="font-semibold">지휘자</p>
              <p className="mt-1">{previousExchange.question}</p>
            </div>
            <div className="ml-auto w-fit max-w-[90%] rounded-2xl bg-gre-selection p-4">
              <p className="font-semibold">나</p>
              <p>{previousExchange.answer}</p>
            </div>
          </>
        )}
        <div className="max-w-prose">
          <h4 className="font-semibold">지휘자 · 추가 정보 요청</h4>
          <p className="mt-1">{question}</p>
        </div>
        {replies.map((reply) => (
          <div key={reply.id} className="ml-auto w-fit max-w-[90%] rounded-2xl bg-gre-selection p-4">
            <p className="font-semibold">나</p>
            {reply.message && <p className="whitespace-pre-wrap wrap-anywhere">{reply.message}</p>}
            {reply.files.length > 0 && (
              <ul aria-label="첨부 파일" className="text-gre-muted">
                {reply.files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="wrap-anywhere">{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <ChatComposer
          inputLabel="지휘자에게 답변"
          placeholder="요청받은 추가 정보를 입력하세요."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          attachmentCount={files.length}
          attachmentAccept={EVIDENCE_PHOTO_ACCEPT}
          onAttach={handleAttach}
          actionLabel="답변 보내기"
          disabled={!canSend}
        >
          {files.length > 0 && (
            <div className="flex items-start justify-between gap-3 text-sm text-gre-muted">
              <ul aria-label="첨부할 파일" className="min-w-0">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="wrap-anywhere">{file.name}</li>
                ))}
              </ul>
              <button type="button" className="shrink-0 underline" onClick={() => setFiles([])}>
                첨부 지우기
              </button>
            </div>
          )}
        </ChatComposer>
      </form>
    </section>
  );
}
