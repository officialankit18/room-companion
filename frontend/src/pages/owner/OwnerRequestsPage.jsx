import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { interestApi } from "../../api/interestApi";
import { Badge, Button, Card, EmptyState, PageHeader, Spinner } from "../../components/ui";

const statusVariant = {
  PENDING: "warning",
  ACCEPTED: "success",
  DECLINED: "danger",
};

export function OwnerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await interestApi.getOwnerInterests();
      setRequests(response.data.interests);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const decide = async (id, action) => {
    try {
      if (action === "accept") {
        await interestApi.acceptInterest(id);
        toast.success("Interest accepted");
      } else {
        await interestApi.declineInterest(id);
        toast.success("Interest declined");
      }
      loadRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Requests"
        title="Review interested tenants"
        description="Accepting a request creates a conversation. Declining keeps the history without opening chat."
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading requests" />
        </div>
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request._id}>
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-[var(--color-heading)]">
                      {request.tenantId?.name}
                    </h2>
                    <Badge variant={statusVariant[request.status] || "neutral"}>{request.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-body)]">
                    Interested in {request.listingId?.title} · {request.listingId?.location?.locality}, {request.listingId?.location?.city}
                  </p>
                </div>
                {request.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <Button size="sm" type="button" onClick={() => decide(request._id, "accept")}>
                      <Check size={16} /> Accept
                    </Button>
                    <Button variant="danger" size="sm" type="button" onClick={() => decide(request._id, "decline")}>
                      <X size={16} /> Decline
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No requests yet" description="Tenant interest requests will appear here." />
      )}
    </>
  );
}

