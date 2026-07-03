import { Card, PageHeader } from "../components/ui";
import { useAuth } from "../hooks/useAuth";

export function DashboardPlaceholder({ title, description }) {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow={user?.role}
        title={title}
        description={description}
      />
      <Card>
        <p className="text-sm leading-6 text-[var(--color-body)]">
          This workspace is connected to the authentication shell. Feature-specific screens will
          be implemented in the next frontend phases.
        </p>
      </Card>
    </>
  );
}

