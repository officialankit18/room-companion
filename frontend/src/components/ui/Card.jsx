import { cn } from "../../utils/cn";

export function Card({ as: Component = "div", className, children }) {
  return <Component className={cn("surface p-6", className)}>{children}</Component>;
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-heading)]">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[var(--color-body)]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
