export function PlaceholderPage({ title, description }) {
  return (
    <section className="page-container py-12">
      <div className="surface p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          RoomCompanion
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--color-heading)]">{title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--color-body)]">{description}</p>
      </div>
    </section>
  );
}

