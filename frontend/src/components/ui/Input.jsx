import { cn } from "../../utils/cn";

export function Input({ label, error, className, id, ...props }) {
  const inputId = id || props.name;

  return (
    <label className="block" htmlFor={inputId}>
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-[var(--color-heading)]">
          {label}
        </span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "focus-ring h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-heading)] outline-none transition placeholder:text-[var(--color-muted)]",
          error && "border-[var(--color-error)]",
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-[var(--color-error)]">{error}</span> : null}
    </label>
  );
}

