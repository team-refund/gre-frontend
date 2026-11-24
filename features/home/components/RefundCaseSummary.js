import Link from 'next/link';

const EXAMPLE_CASE_COUNTS = [
  { label: '전체 사건', count: '05', description: '나의 모든 환불 요청' },
  { label: '대응 중', count: '02', description: '초안 승인 · 판매자 회신' },
  { label: '승인 필요', count: '01', description: '영문 이메일 발송 승인' },
  { label: '환불 확인 대기', count: '01', description: '실제 입금 여부 확인' },
];

export default function RefundCaseSummary() {
  return (
    <section className="mt-7" aria-labelledby="case-status-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="case-status-heading" className="text-2xl font-bold @2xl:text-[28px]">
          내 환불 사건 현황
        </h2>
        <Link href="/cases" className="text-sm font-semibold text-gre-accent hover:underline">
          전체 사건 보기 →
        </Link>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4">
        {EXAMPLE_CASE_COUNTS.map(({ label, count, description }) => (
          <div
            key={label}
            className="rounded-[10px] border border-gre-border bg-white p-4 @3xl:p-6"
          >
            <dt className="text-xs text-gre-muted">{label}</dt>
            <dd className="mt-3 text-[32px] leading-9 font-bold">{count}</dd>
            <dd className="mt-2 text-xs text-gre-muted">{description}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex min-h-[88px] flex-wrap items-center justify-between gap-4
        rounded-xl bg-gre-selection px-5 py-4">
        <div>
          <p className="font-bold">확인이 필요한 이메일이 1건 있어요.</p>
          <p className="mt-2 text-xs text-gre-muted">
            해외 주문 환불 지연 / 초안 v3의 내용을 검토해 주세요.
          </p>
        </div>
        <Link href="/cases" className="rounded-xl bg-gre-accent px-4 py-3 text-sm font-medium
          text-white hover:brightness-95">
          초안 검토하기 →
        </Link>
      </div>
    </section>
  );
}
