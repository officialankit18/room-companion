export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)] md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl leading-7 text-[var(--color-body)]">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

