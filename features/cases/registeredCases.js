'use client';

const EMPTY_CASES = [];
let registeredCases = EMPTY_CASES;
const listeners = new Set();
const runsByCaseId = new Map();
const repliesByRun = new Map();
const EMPTY_REPLIES = [];

function publish(cases) {
  registeredCases = cases;
  listeners.forEach((listener) => listener());
}

export function subscribeToRegisteredCases(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRegisteredCases() {
  return registeredCases;
}

export function getServerRegisteredCases() {
  return EMPTY_CASES;
}

export function registerCase(draft) {
  const id = `preview-${crypto.randomUUID()}`;
  publish([...registeredCases, {
    id,
    name: `${draft.seller} · ${draft.type}`,
    seller: draft.seller,
    requirement: draft.description,
    files: draft.files,
    status: '대응 중',
    tone: 'accent',
    group: 'active',
    next: 'AI 분석',
  }]);
  return id;
}

export function closeRegisteredCase(id) {
  publish(registeredCases.map((item) => (item.id === id
    ? { ...item, status: '종료', tone: 'success', group: 'closed', next: '사건 처리 완료' }
    : item)));
}

export function getLatestRun(id) {
  return runsByCaseId.get(id)?.at(-1) ?? null;
}

export function saveLatestRun(id, run) {
  runsByCaseId.set(id, [...(runsByCaseId.get(id) ?? []), run]);
  listeners.forEach((listener) => listener());
}

export function getRunReplies(runId) {
  return repliesByRun.get(runId) ?? EMPTY_REPLIES;
}

export function addRunReply(runId, reply) {
  repliesByRun.set(runId, [...getRunReplies(runId), reply]);
  listeners.forEach((listener) => listener());
}
