import Link from 'next/link';

const PROCESS_STEPS = ['사건 등록', 'AI 분석', '이메일 대응', '환불 확인'];

const FAQ = [
  ['어떤 문제를 등록할 수 있나요?', '환불 지연, 상품 미배송, 중복 결제, 상품 불량 등을 등록할 수 있습니다.'],
  ['이메일은 어떻게 발송되나요?', 'AI가 작성한 이메일 초안을 검토하고 승인하면 연결된 Gmail에서 발송됩니다.'],
  ['환불 진행 상황은 어떻게 확인하나요?', '내 사건에서 사건별 진행 상태와 판매자 회신을 확인할 수 있습니다.'],
];

const FEATURES = [
  {
    title: '상황을 이해하는 AI',
    description: '구매 정보와 피해 내용을 분석하고 상황에 맞는 환불 대응 방향을 제안합니다.',
    preview: (
      <>
        <p className="font-semibold text-gre-accent">✧ AI 사건 분석</p>
        <ul className="mt-4 space-y-3 text-sm text-gre-muted">
          {['구매 정보 확인', '환불 요청 사유 분석', '대응 방향 제안'].map((label) => (
            <li key={label}>
              <span className="mr-3 text-gre-accent" aria-hidden="true">✓</span>
              {label}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: '언어 장벽 없는 환불 대응',
    description: '직접 영문 이메일을 작성할 필요 없이, AI가 상황에 맞는 이메일 초안을 작성합니다.',
    preview: (
      <div>
        <p lang="en" className="border-b border-gre-border pb-2 font-semibold">
          Request for Refund
        </p>
        <p lang="en" className="mt-2 text-sm text-gre-muted">Dear Customer Service,</p>
        <div className="mt-3 space-y-2" aria-hidden="true">
          <div className="h-1 w-full bg-gre-border" />
          <div className="h-1 w-11/12 bg-gre-border" />
          <div className="h-1 w-4/5 bg-gre-border" />
          <div className="h-1 w-3/5 bg-gre-border" />
        </div>
        <div className="mt-2 text-right" aria-hidden="true">
          <span className="inline-block rounded-xl bg-gre-accent px-4 py-3 text-sm text-white">
            초안 검토하기
          </span>
        </div>
      </div>
    ),
  },
  {
    title: '마지막까지 이어지는 사건 관리',
    description: '판매자의 답변부터 실제 환불 여부까지 모든 진행 상황을 한곳에서 관리합니다.',
    preview: (
      <ul className="space-y-3 text-sm text-gre-muted">
        {['사건 등록', '이메일 발송', '판매자 회신', '환불 확인'].map((label, index) => (
          <li key={label} className="flex items-center gap-3">
            <span aria-hidden="true" className={index < 2 ? 'text-gre-accent' : 'text-gre-muted'}>
              {index < 2 ? '✓' : '●'}
            </span>
            {label}
            {index === 2 && (
              <span className="ml-auto rounded bg-gre-selection px-2 py-1 text-xs text-gre-accent">
                대기 중
              </span>
            )}
          </li>
        ))}
      </ul>
    ),
  },
];

export default function HomeOverview() {
  return (
    <div className="mx-auto max-w-[1208px] px-4 pt-12 pb-9 @2xl:px-8 @4xl:px-16 @4xl:pt-14">
      <section aria-labelledby="about-heading">
        <p className="text-xs font-semibold text-gre-accent">ABOUT GRE</p>
        <h2 id="about-heading" className="mt-3 text-4xl leading-tight font-bold @3xl:text-5xl">
          해외 직구 환불의<br />새로운 기준<span className="text-gre-brand-dot">.</span>
        </h2>
        <p className="mt-4 max-w-lg leading-6 text-gre-muted">
          언어와 절차의 어려움으로 포기했던 해외 직구 환불.<br />
          GRE는 복잡한 환불 대응 과정을 지원하는 AI 에이전트입니다.
        </p>
        <div className="mt-10">
          {FEATURES.map(({ title, description, preview }, index) => (
            <article
              key={title}
              className="grid items-center gap-5 border-t border-[#e0e5f0] py-[30px]
                @3xl:grid-cols-2 @3xl:gap-16"
            >
              <div>
                <p aria-hidden="true" className="text-[32px] leading-10 font-medium text-gre-accent">
                  0{index + 1}
                </p>
                <h3 className="text-2xl font-bold @3xl:text-[28px]">{title}</h3>
                <p className="mt-3 max-w-sm leading-[1.7] text-gre-muted">{description}</p>
              </div>
              <div className="rounded-xl bg-[#f5f6fa] p-4 @3xl:p-5">
                <div className="min-h-40 rounded-[10px] border border-gre-border bg-white p-5
                  @3xl:min-h-[188px]">
                  {preview}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-gre-border pt-10" aria-labelledby="process-heading">
        <p className="text-xs font-semibold text-gre-accent">HOW IT WORKS</p>
        <h2 id="process-heading" className="mt-3 text-2xl font-bold @3xl:text-3xl">환불 해결까지의 과정</h2>
        <ol className="mt-6 grid grid-cols-2 gap-4 @3xl:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step} className="border-t-2 border-gre-accent pt-3 font-semibold">
              <span className="mb-1 block text-3xl text-gre-accent" aria-hidden="true">
                0{index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-9 rounded-xl bg-[#f5f6fa] p-6 @3xl:p-8">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" className="mb-3 size-5 text-gre-accent">
            <path d="M4 3h16v8c0 5-3 8-8 10-5-2-8-5-8-10V3Z" />
            <path d="m8 11 3 3 5-5" />
          </svg>
          <h3 className="text-2xl font-bold @3xl:text-[28px]">AI가 돕고, 사용자가 결정합니다.</h3>
          <p className="mt-3 text-gre-muted">
            사용자의 승인 없이 이메일을 발송하지 않습니다. 모든 대응 과정을 직접 확인하고 결정할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mt-9" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-5 text-2xl font-bold @3xl:text-3xl">자주 묻는 질문</h2>
        {FAQ.map(([question, answer]) => (
          <details key={question} className="group border-t border-gre-border">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between
              gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {question}
              <span aria-hidden="true" className="text-xl text-gre-muted group-open:hidden">+</span>
              <span aria-hidden="true" className="hidden text-xl text-gre-muted group-open:inline">
                −
              </span>
            </summary>
            <p className="pb-4 text-sm text-gre-muted">{answer}</p>
          </details>
        ))}
      </section>

      <section className="mt-8 rounded-xl bg-gre-accent px-6 py-7 text-white @3xl:px-9">
        <p aria-hidden="true" className="text-[34px] leading-none font-black">
          GRE<span className="ml-1 inline-block size-2 rounded-full bg-gre-brand-dot align-top" />
        </p>
        <h2 className="mt-3 text-2xl font-bold @3xl:text-3xl">해외 직구 환불, 이제 GRE와 함께하세요.</h2>
        <Link href="/cases/register" className="mt-6 inline-flex rounded-xl bg-white px-4 py-3
          text-sm font-semibold text-gre-accent hover:bg-gre-selection">
          새 사건 등록하기 →
        </Link>
      </section>
    </div>
  );
}
