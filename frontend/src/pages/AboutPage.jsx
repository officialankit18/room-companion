import { Brain, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";

import { Card, PageHeader } from "../components/ui";

const features = [
  {
    icon: Brain,
    title: "AI compatibility scoring",
    description: "Tenant preferences and listing details are compared through AI with a fallback engine.",
  },
  {
    icon: ShieldCheck,
    title: "Owner-controlled approvals",
    description: "Chat only unlocks after the owner accepts an interest request.",
  },
  {
    icon: MessageSquare,
    title: "Persistent realtime chat",
    description: "Accepted users can continue discussions with saved messages and unread tracking.",
  },
  {
    icon: CheckCircle2,
    title: "No unnecessary booking flow",
    description: "RoomCompanion connects people. The final rental agreement happens offline.",
  },
];

export function AboutPage() {
  return (
    <section className="page-container py-10">
      <PageHeader
        eyebrow="About"
        title="A focused room discovery platform"
        description="RoomCompanion is built for a practical rental workflow: discover, compare compatibility, request, approve, chat, and finalize offline."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <Icon className="text-[var(--color-primary)]" size={24} />
              <h2 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

