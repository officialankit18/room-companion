import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-indigo-700",
  secondary:
    "border border-[var(--color-border)] bg-white text-[var(--color-heading)] hover:bg-slate-50",
  success: "bg-[var(--color-success)] text-white hover:bg-emerald-600",
  danger: "bg-[var(--color-error)] text-white hover:bg-red-600",
  ghost: "text-[var(--color-body)] hover:bg-slate-100 hover:text-[var(--color-heading)]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
