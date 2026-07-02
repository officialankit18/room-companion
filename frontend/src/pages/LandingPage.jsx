import { ArrowRight, Brain, MessageSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge, Button, Card } from "../components/ui";

const highlights = [
  {
    icon: Search,
    title: "Discover rooms",
    description: "Browse active listings by city, locality, budget, and room type.",
  },
  {
    icon: Brain,
    title: "AI compatibility",
    description: "See match scores that explain how well a room fits tenant preferences.",
  },
  {
    icon: MessageSquare,
    title: "Chat after approval",
    description: "Owners approve requests before realtime conversations unlock.",
  },
];

export function LandingPage() {
  return (
    <section className="page-container py-14 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            AI powered rent and flatmate matching
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[var(--color-heading)] sm:text-5xl lg:text-6xl">
            Find the Right Room. Meet the Right Roommate.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-body)]">
            RoomCompanion helps tenants discover suitable rooms and helps owners connect with
            high-intent, compatible tenants through requests, approvals, and secure chat.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              as={Link}
              to="/register"
              size="lg"
            >
              Get started
              <ArrowRight size={18} />
            </Button>
            <Button
              as={Link}
              to="/browse"
              variant="secondary"
              size="lg"
            >
              Browse listings
            </Button>
          </div>
        </div>

        <Card className="p-5">
          <div className="rounded-xl border border-[var(--color-border)] bg-[#f8fafc] p-5">
            <div className="aspect-[4/3] rounded-xl bg-white p-5 shadow-sm">
              <div className="h-44 rounded-xl bg-[linear-gradient(135deg,#4f46e5,#2563eb)]" />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--color-heading)]">Private Room in Noida</p>
                  <p className="mt-1 text-sm text-[var(--color-body)]">Sector 62 · ₹9,000/month</p>
                </div>
                <Badge variant="success">94% Match</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--color-body)]">
                Excellent location match and rent falls comfortably within the tenant budget.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card as="article" key={item.title}>
              <Icon className="text-[var(--color-primary)]" size={24} />
              <h2 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
