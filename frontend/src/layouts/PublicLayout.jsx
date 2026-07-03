import { Home, LogIn, UserPlus } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse" },
  { label: "About", to: "/about" },
];

export function PublicLayout() {
  return (
    <div className="app-shell">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="page-container flex min-h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-[var(--color-heading)]">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
              <Home size={18} />
            </span>
            <span>RoomCompanion</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--color-body)] md:flex">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-[var(--color-primary)]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-heading)]"
            >
              <LogIn size={16} />
              Login
            </Link>
            <Link
              to="/register"
              className="focus-ring hidden h-10 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-semibold text-white sm:inline-flex"
            >
              <UserPlus size={16} />
              Register
            </Link>
          </div>
        </div>
        <nav className="page-container flex gap-2 overflow-x-auto pb-3 text-sm font-semibold text-[var(--color-body)] md:hidden">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="shrink-0 rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-[var(--color-primary)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
