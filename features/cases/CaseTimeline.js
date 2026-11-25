const TIMELINE_EVENTS = [
  '11/18 · 후속 답변 준비 중',
  '11/16 · 판매자 회신 수신',
  '11/14 · 문의 이메일 발송',
];

export default function CaseTimeline({ compact = false }) {
  return (
    <ol className={compact ? 'mb-4 space-y-3 text-sm text-gre-muted' : 'divide-y divide-gre-border text-sm'}>
      {TIMELINE_EVENTS.map((event) => (
        <li key={event} className={compact ? undefined : 'py-4'}>{event}</li>
      ))}
    </ol>
  );
}
