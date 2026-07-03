import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { notificationApi } from "../../api/notificationApi";
import { USER_ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui";

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const notificationPath =
    user?.role === USER_ROLES.OWNER
      ? "/owner/notifications"
      : user?.role === USER_ROLES.ADMIN
        ? "/admin/notifications"
        : "/tenant/notifications";
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await notificationApi.getNotifications();
        setNotifications(response.data.notifications.slice(0, 5));
      } catch (error) {
        // Header notifications are non-blocking.
      }
    };

    loadNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative">
      <Button variant="secondary" size="sm" type="button" onClick={() => setOpen((value) => !value)}>
        <Bell size={16} />
        {unreadCount ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-[var(--color-error)] px-1.5 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-[var(--color-heading)]">Notifications</p>
            <button className="text-xs font-semibold text-[var(--color-primary)]" type="button" onClick={markAllRead}>
              Mark all read
            </button>
          </div>

          {notifications.length ? (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="rounded-xl bg-slate-50 p-3 text-left"
                >
                  <p className="text-sm font-semibold text-[var(--color-heading)]">{notification.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--color-body)]">
                    {notification.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-5 text-center text-sm text-[var(--color-body)]">No notifications</p>
          )}

          <Link
            to={notificationPath}
            className="mt-3 block rounded-xl border border-[var(--color-border)] px-3 py-2 text-center text-sm font-semibold text-[var(--color-heading)]"
            onClick={() => setOpen(false)}
          >
            View all
          </Link>
        </div>
      ) : null}
    </div>
  );
}
