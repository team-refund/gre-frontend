'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { setRefundDraft } from '@/features/home/refundDraft';

export default function RefundIntake() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  function handleContinue() {
    const trimmedDescription = description.trim();
    if (trimmedDescription || attachments.length > 0) {
      setRefundDraft({ description: trimmedDescription, files: attachments });
    }

    router.push('/cases/register');
  }

  return (
    <section className="mx-auto max-w-[800px] text-center" aria-labelledby="refund-heading">
      <div aria-hidden="true" className="text-5xl font-black tracking-tight text-gre-accent">
        GRE<span className="ml-1 inline-block size-2 rounded-full bg-gre-brand-dot align-top" />
      </div>
      <h1 id="refund-heading" className="mt-3 text-3xl font-bold tracking-tight @2xl:text-4xl/12">
        어떤 환불 문제가 있으신가요?
      </h1>
      <p className="mt-2 text-gre-muted">해외 직구 중 겪은 문제를 알려주세요.</p>
      <div className="mt-[18px] grid h-40 grid-rows-[1fr_auto] rounded-2xl border border-gre-border
        bg-white px-6 py-[17px] text-left">
        <textarea
          aria-label="환불 문제 설명"
          placeholder="상품을 반품했는데 아직 환불받지 못했어요."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-0 w-full resize-none rounded text-base leading-6 outline-gre-accent
            placeholder:text-[#8995ae]"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-1 rounded text-sm
            font-medium text-gre-muted
            focus-within:outline-2 focus-within:outline-gre-accent">
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => setAttachments(Array.from(event.target.files))}
            />
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" className="size-5">
              <path d="m8 13 6 6a4 4 0 0 0 6-6L10 3a3 3 0 0 0-4 4l9 9a1.5 1.5 0 0 0 2-2l-7-7" />
            </svg>
            증빙자료 첨부{attachments.length > 0 && ` (${attachments.length})`}
          </label>
          <button
            type="button"
            aria-label="사건 등록으로 이동"
            onClick={handleContinue}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[10px]
              bg-gre-accent text-xl text-white hover:brightness-95"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
