'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ChatComposer from '@/components/ui/ChatComposer';
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
      <div className="mt-[18px]">
        <ChatComposer
          inputLabel="환불 문제 설명"
          placeholder="상품을 반품했는데 아직 환불받지 못했어요."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          attachmentCount={attachments.length}
          onAttach={(event) => setAttachments(Array.from(event.target.files))}
          actionLabel="사건 등록으로 이동"
          onAction={handleContinue}
        />
      </div>
    </section>
  );
}
