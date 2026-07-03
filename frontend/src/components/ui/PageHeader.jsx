export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-2xl font-bold text-[var(--color-heading)] sm:text-3xl md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl leading-7 text-[var(--color-body)]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
