'use client';

let refundDraft = null;
const listeners = new Set();

export function setRefundDraft(draft) {
  refundDraft = draft;
  listeners.forEach((listener) => listener());
}

export function subscribeToRefundDraft(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRefundDraft() {
  return refundDraft;
}

export function getServerRefundDraft() {
  return null;
}
