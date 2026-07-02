export function Spinner({ label = "Loading" }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--color-body)]">
      <span className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-[var(--color-primary)]" />
      {label}
    </span>
  );
}

