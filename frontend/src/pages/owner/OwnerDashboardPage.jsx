import { ClipboardList, Home, Inbox, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, Card, PageHeader } from "../../components/ui";

const actions = [
  {
    icon: Home,
    title: "Create listings",
    description: "Publish rooms with rent, location, availability, furnishing, and photos.",
    to: "/owner/listings",
  },
  {
    icon: Inbox,
    title: "Review requests",
    description: "Accept or decline tenant interests with compatibility context.",
    to: "/owner/requests",
  },
  {
    icon: MessageSquare,
    title: "Continue chats",
    description: "Chat with tenants after requests are accepted.",
    to: "/owner/chat",
  },
  {
    icon: ClipboardList,
    title: "Manage availability",
    description: "Mark listings filled so they disappear from tenant search results.",
    to: "/owner/listings",
  },
];

export function OwnerDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Owner"
        title="Manage your rental pipeline"
        description="Create listings, evaluate interested tenants, and unlock chat after approval."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title}>
              <Icon className="text-[var(--color-primary)]" size={24} />
              <h2 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">{action.description}</p>
              <Button as={Link} to={action.to} variant="secondary" className="mt-5">
                Open
              </Button>
            </Card>
          );
        })}
      </div>
    </>
  );
}

