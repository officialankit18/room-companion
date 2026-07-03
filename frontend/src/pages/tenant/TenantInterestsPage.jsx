import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { interestApi } from "../../api/interestApi";
import { Badge, Card, EmptyState, PageHeader, Spinner } from "../../components/ui";

const statusVariant = {
  PENDING: "warning",
  ACCEPTED: "success",
  DECLINED: "danger",
};

export function TenantInterestsPage() {
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const response = await interestApi.getTenantInterests();
        setInterests(response.data.interests);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterests();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Interests"
        title="Track your room requests"
        description="See owner decisions and continue to chat once an interest is accepted."
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Loading interests" />
        </div>
      ) : interests.length ? (
        <div className="space-y-4">
          {interests.map((interest) => (
            <Card key={interest._id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-semibold text-[var(--color-heading)]">
                    {interest.listingId?.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-body)]">
                    Owner: {interest.ownerId?.name} · Sent {new Date(interest.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={statusVariant[interest.status] || "neutral"}>{interest.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No interests sent"
          description="Send interest from a matched listing to start owner approval."
        />
      )}
    </>
  );
}

