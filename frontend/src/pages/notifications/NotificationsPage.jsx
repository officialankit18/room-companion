import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { notificationApi } from "../../api/notificationApi";
import { Badge, Button, Card, EmptyState, PageHeader, Spinner } from "../../components/ui";

const typeLabel = {
  INTEREST_RECEIVED: "New interest",
  INTEREST_ACCEPTED: "Accepted",
  INTEREST_DECLINED: "Declined",
  HIGH_MATCH: "High match",
  NEW_MESSAGE: "Message",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((items) =>
        items.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
      toast.success("All notifications marked read");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Notifications"
        title="Platform updates"
        description="Track interest decisions, high compatibility matches, and new messages."
        action={
          <Button variant="secondary" type="button" onClick={markAllRead}>
            <CheckCheck size={18} />
            Mark all read
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Loading notifications" />
        </div>
      ) : notifications.length ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification._id} className={notification.isRead ? "opacity-75" : ""}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-[var(--color-heading)]">{notification.title}</h2>
                    <Badge variant={notification.isRead ? "neutral" : "indigo"}>
                      {typeLabel[notification.type] || notification.type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-body)]">
                    {notification.description}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead ? (
                  <Button variant="secondary" size="sm" type="button" onClick={() => markRead(notification._id)}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications" description="Important updates will appear here." />
      )}
    </>
  );
}

