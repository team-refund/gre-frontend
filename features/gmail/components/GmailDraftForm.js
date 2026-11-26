'use client';

import { useState } from 'react';

import { ConceptCard } from '@/components/ui/ConceptLayout';
import { createGmailDraft, gmailErrorMessage } from '@/features/gmail/api/gmailApi';

export default function GmailDraftForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function handleSave(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSaving(true);
    setNotice('');
    setError('');
    try {
      await createGmailDraft({
        to: String(data.get('to')).trim(),
        subject: String(data.get('subject')).trim(),
        body: String(data.get('body')),
      });
      form.reset();
      setNotice('Gmail 임시보관함에 초안을 저장했어요.');
    } catch (failure) {
      setError(gmailErrorMessage(failure, 'Gmail 초안을 저장하지 못했어요.'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ConceptCard title="Gmail 임시보관함">
      <form className="grid gap-3" onSubmit={handleSave}>
        <label className="gre-label">
          받는 사람
          <input className="gre-field" type="email" name="to" required maxLength={254} />
        </label>
        <label className="gre-label">
          제목
          <input className="gre-field" name="subject" required maxLength={200} />
        </label>
        <label className="gre-label">
          본문
          <textarea className="gre-field" name="body" required rows={5} maxLength={20000} />
        </label>
        <button type="submit" className="gre-button justify-self-start" disabled={isSaving}>
          {isSaving ? '저장 중…' : 'Gmail 임시보관함에 저장'}
        </button>
      </form>
      {notice && <p role="status" className="mt-3 text-sm text-gre-muted">{notice}</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </ConceptCard>
  );
}
