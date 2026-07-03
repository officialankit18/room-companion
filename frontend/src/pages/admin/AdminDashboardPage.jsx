import { Activity, Home, MessageSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/adminApi";
import { Card, PageHeader, Spinner } from "../../components/ui";

const statCards = [
  { key: "users", label: "Users", icon: Users },
  { key: "listings", label: "Listings", icon: Home },
  { key: "conversations", label: "Conversations", icon: MessageSquare },
  { key: "interests", label: "Interests", icon: Activity },
];

export function AdminDashboardPage() {
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await adminApi.getActivity();
        setActivity(response.data.activity);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivity();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Platform activity"
        description="Monitor users, listings, interests, conversations, messages, and notifications."
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Loading activity" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const value = activity?.[stat.key]?.total ?? 0;
            return (
              <Card key={stat.key}>
                <Icon className="text-[var(--color-primary)]" size={24} />
                <p className="mt-5 text-sm font-semibold text-[var(--color-body)]">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-[var(--color-heading)]">{value}</p>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

