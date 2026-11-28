export default function ChatComposer({
  inputLabel,
  placeholder,
  value,
  onChange,
  onKeyDown,
  attachmentCount,
  attachmentAccept,
  onAttach,
  actionLabel,
  onAction,
  disabled = false,
  children,
}) {
  return (
    <div className="grid min-h-40 grid-rows-[1fr_auto] rounded-2xl border border-gre-border
      bg-white px-6 py-[17px] text-left">
      <textarea
        aria-label={inputLabel}
        placeholder={placeholder}
        rows={3}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="min-h-0 w-full resize-none rounded text-base leading-6 outline-gre-accent
          placeholder:text-[#8995ae]"
      />
      <div className="mt-2 space-y-2">
        {children}
        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-1 rounded text-sm
            font-medium text-gre-muted focus-within:outline-2 focus-within:outline-gre-accent">
            <input type="file" multiple className="sr-only" accept={attachmentAccept}
              onChange={onAttach} />
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" className="size-5">
              <path d="m8 13 6 6a4 4 0 0 0 6-6L10 3a3 3 0 0 0-4 4l9 9a1.5 1.5 0 0 0 2-2l-7-7" />
            </svg>
            증빙자료 첨부{attachmentCount > 0 && ` (${attachmentCount})`}
          </label>
          <button
            type={onAction ? 'button' : 'submit'}
            aria-label={actionLabel}
            onClick={onAction}
            disabled={disabled}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[10px]
              bg-gre-accent text-white hover:brightness-95 disabled:cursor-not-allowed
              disabled:opacity-50"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
