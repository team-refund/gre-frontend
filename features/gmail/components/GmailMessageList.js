'use client';

import { useState } from 'react';

import { ConceptCard } from '@/components/ui/ConceptLayout';
import { gmailErrorMessage, searchGmailMessages } from '@/features/gmail/api/gmailApi';

const DATE_FORMAT = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Seoul',
});

export default function GmailMessageList() {
  const [result, setResult] = useState(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function loadMessages(query, pageToken) {
    setIsLoading(true);
    setError('');
    try {
      const page = await searchGmailMessages(query, pageToken);
      setActiveQuery(query);
      setResult((current) => ({
        messages: pageToken ? [...(current?.messages ?? []), ...page.messages] : page.messages,
        nextPageToken: page.nextPageToken,
      }));
    } catch (failure) {
      setError(gmailErrorMessage(failure, 'Gmail 메일을 불러오지 못했어요.'));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    loadMessages(String(data.get('query') ?? '').trim());
  }

  return (
    <ConceptCard title="Gmail 메일 조회">
      <form className="flex flex-wrap items-end gap-2" onSubmit={handleSearch}>
        <label className="gre-label min-w-44 flex-1">
          검색어
          <input name="query" className="gre-field" placeholder="예: from:seller@example.com" />
        </label>
        <button type="submit" className="gre-button gre-button-primary" disabled={isLoading}>
          메일 조회
        </button>
      </form>
      {isLoading && <p role="status" className="mt-3 text-sm">메일을 불러오는 중이에요.</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {result?.messages.length === 0 && (
        <p className="mt-4 text-sm text-gre-muted">검색 결과가 없어요.</p>
      )}
      {result?.messages.length > 0 && (
        <ul className="mt-4 divide-y divide-gre-border">
          {result.messages.map((message) => (
            <li key={message.gmailMessageId} className="py-3">
              <p className="font-medium wrap-anywhere">{message.subject || '(제목 없음)'}</p>
              <p className="mt-1 text-xs wrap-anywhere text-gre-muted">
                {message.from || '발신자 미상'}
                {message.receivedAt && ` · ${DATE_FORMAT.format(new Date(message.receivedAt))}`}
              </p>
              {message.snippet && <p className="mt-2 text-sm wrap-anywhere">{message.snippet}</p>}
            </li>
          ))}
        </ul>
      )}
      {result?.nextPageToken && (
        <button className="gre-button mt-3" type="button" disabled={isLoading}
          onClick={() => loadMessages(activeQuery, result.nextPageToken)}>
          더 보기
        </button>
      )}
    </ConceptCard>
  );
}
