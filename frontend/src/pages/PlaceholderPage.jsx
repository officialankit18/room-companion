import { Card, PageHeader } from "../components/ui";

export function PlaceholderPage({ title, description }) {
  return (
    <section className="page-container py-12">
      <Card className="p-8">
        <PageHeader eyebrow="RoomCompanion" title={title} description={description} />
      </Card>
    </section>
  );
}
