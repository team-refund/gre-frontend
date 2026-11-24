'use client';

import { useSyncExternalStore } from 'react';

import {
  getRefundDraft,
  getServerRefundDraft,
  subscribeToRefundDraft,
} from '@/features/home/refundDraft';

export default function RefundDraftPreview() {
  const draft = useSyncExternalStore(
    subscribeToRefundDraft,
    getRefundDraft,
    getServerRefundDraft,
  );

  if (!draft) return null;

  return (
    <section className="mt-5 max-w-3xl rounded-xl border border-gre-border p-5">
      <h2 className="font-semibold">작성한 환불 문제</h2>
      <p className="mt-2 whitespace-pre-wrap wrap-anywhere">{draft.description}</p>
      {draft.files.length > 0 && (
        <ul aria-label="첨부한 증빙자료" className="mt-4 space-y-1 text-sm text-gre-muted">
          {draft.files.map((file, index) => (
            <li key={`${index}-${file.name}`} className="wrap-anywhere">
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
