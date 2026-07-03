import { Brain, HeartHandshake, MessageSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, Card, PageHeader } from "../../components/ui";

const actions = [
  {
    icon: Search,
    title: "Find matches",
    description: "Browse AI-ranked listings based on your location, budget, and move-in date.",
    to: "/tenant/matches",
  },
  {
    icon: Brain,
    title: "Update profile",
    description: "Keep your preferences fresh so compatibility scores stay accurate.",
    to: "/tenant/profile",
  },
  {
    icon: HeartHandshake,
    title: "Track interests",
    description: "See pending, accepted, and declined owner decisions.",
    to: "/tenant/interests",
  },
  {
    icon: MessageSquare,
    title: "Open chats",
    description: "Continue conversations after owners accept your request.",
    to: "/tenant/chat",
  },
];

export function TenantDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tenant"
        title="Find rooms that actually fit"
        description="Start with your preferences, compare AI-ranked listings, send interest, and chat after approval."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title}>
              <Icon className="text-[var(--color-primary)]" size={24} />
              <h2 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">
                {action.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">
                {action.description}
              </p>
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

