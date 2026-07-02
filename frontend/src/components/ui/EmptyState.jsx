import { SearchX } from "lucide-react";

import { Button } from "./Button";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-[var(--color-primary)]">
        <SearchX size={24} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-body)]">{description}</p>
      {actionLabel ? (
        <Button className="mt-6" type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

