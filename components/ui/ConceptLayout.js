import Link from 'next/link';

export function ConceptPage({ title, description, action, children }) {
  return (
    <main className="flex-1 bg-gre-canvas px-4 py-8 text-gre-text @sm:px-6 @4xl:px-12 @4xl:py-10">
      <div className="mx-auto max-w-[1112px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="mt-2 text-sm text-gre-muted">{description}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </main>
  );
}

export function ConceptCard({ title, children, className = '' }) {
  return (
    <section className={`min-w-0 rounded-[15px] border border-gre-border bg-white p-6 ${className}`}>
      {title && <h2 className="mb-3 text-lg font-bold">{title}</h2>}
      {children}
    </section>
  );
}

export function ConceptLink({ href, children, primary = false }) {
  return (
    <Link className={primary ? 'gre-button gre-button-primary' : 'gre-button'} href={href}>
      {children}
    </Link>
  );
}

export function ConceptBadge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-slate-100 text-slate-600',
    accent: 'bg-gre-selection text-gre-accent',
    success: 'bg-emerald-50 text-emerald-800',
    approval: 'bg-amber-50 text-amber-800',
  };

  return <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${tones[tone]}`}>
    {children}
  </span>;
}
