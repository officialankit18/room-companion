import { Home, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { NotificationBell } from "../components/notifications/NotificationBell";
import { Button } from "../components/ui";
import { USER_ROLES } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

const navByRole = {
  [USER_ROLES.TENANT]: [
    { label: "Dashboard", to: "/tenant" },
    { label: "Profile", to: "/tenant/profile" },
    { label: "Matches", to: "/tenant/matches" },
    { label: "Interests", to: "/tenant/interests" },
    { label: "Chat", to: "/tenant/chat" },
    { label: "Notifications", to: "/tenant/notifications" },
  ],
  [USER_ROLES.OWNER]: [
    { label: "Dashboard", to: "/owner" },
    { label: "Listings", to: "/owner/listings" },
    { label: "Requests", to: "/owner/requests" },
    { label: "Chat", to: "/owner/chat" },
    { label: "Notifications", to: "/owner/notifications" },
  ],
  [USER_ROLES.ADMIN]: [
    { label: "Dashboard", to: "/admin" },
    { label: "Users", to: "/admin/users" },
    { label: "Listings", to: "/admin/listings" },
    { label: "Notifications", to: "/admin/notifications" },
  ],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navItems = navByRole[user?.role] || [];

  return (
    <div className="app-shell">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--color-border)] bg-white p-5 lg:block">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-heading)]">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
            <Home size={18} />
          </span>
          RoomCompanion
        </div>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex rounded-xl px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-indigo-50 text-[var(--color-primary)]"
                    : "text-[var(--color-body)] hover:bg-slate-50 hover:text-[var(--color-heading)]",
                ].join(" ")
              }
              end
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:px-8">
            <div className="min-w-0">
              <p className="text-sm text-[var(--color-muted)]">Signed in as</p>
              <p className="truncate font-semibold text-[var(--color-heading)]">{user?.name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <NotificationBell />
              <Button variant="ghost" size="sm" type="button" onClick={logout} className="px-2 sm:px-3">
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-[var(--color-border)] px-4 py-2 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-indigo-50 text-[var(--color-primary)]"
                      : "text-[var(--color-body)] hover:bg-slate-50 hover:text-[var(--color-heading)]",
                  ].join(" ")
                }
                end
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="page-container py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
