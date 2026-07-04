import { ChevronDown, LogIn } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Our services", to: "/#our-services" },
];

export function PublicLayout() {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="page-container flex min-h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              alt="RoomCompanion"
              className="h-12 w-12 rounded-2xl object-cover"
              src="/brand/roomcompanion-logo.png"
            />
            <span className="hidden text-xl font-bold text-[var(--color-primary)] sm:inline">
              RoomCompanion
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--color-heading)] md:flex">
            {navItems.map((item) => (
              <a key={item.label} className="transition hover:text-[var(--color-accent)]" href={item.to}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="group relative">
            <button
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-[var(--color-heading)] shadow-sm transition hover:border-[var(--color-accent)]"
              type="button"
            >
              <LogIn size={17} />
              Login
              <ChevronDown size={16} />
            </button>
            <div className="invisible absolute right-0 top-full z-50 mt-3 w-48 translate-y-2 rounded-2xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-[var(--color-heading)] hover:bg-slate-50 hover:text-[var(--color-accent)]"
                to="/login?role=TENANT"
              >
                Login as tenant
              </Link>
              <Link
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-[var(--color-heading)] hover:bg-slate-50 hover:text-[var(--color-accent)]"
                to="/login?role=OWNER"
              >
                Login as owner
              </Link>
            </div>
          </div>
        </div>

        <nav className="page-container flex gap-2 overflow-x-auto pb-3 text-sm font-semibold text-[var(--color-body)] md:hidden">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="shrink-0 rounded-full px-3 py-2 hover:bg-slate-50 hover:text-[var(--color-accent)]"
              href={item.to}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
