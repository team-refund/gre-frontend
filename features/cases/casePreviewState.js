import { cookies } from 'next/headers';
import { CASE_EXAMPLES } from './caseExamples';

const getClosedCookieName = (id) => `gre-preview-closed-${id}`;

export async function getPreviewCases() {
  const cookieStore = await cookies();

  return CASE_EXAMPLES.map((item) => {
    if (item.group === 'closed' || !cookieStore.has(getClosedCookieName(item.id))) {
      return item;
    }

    return { ...item, status: '종료', tone: 'success', group: 'closed', next: '사건 처리 완료' };
  });
}

export async function closePreviewCase(id) {
  'use server';

  const item = CASE_EXAMPLES.find((entry) => entry.id === id);
  if (!item || item.group === 'closed') {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(getClosedCookieName(item.id), '1', { httpOnly: true, path: '/cases' });
}
