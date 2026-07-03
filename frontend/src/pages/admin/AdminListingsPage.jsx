import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/adminApi";
import { Badge, Button, Card, EmptyState, Input, PageHeader, Select, Spinner } from "../../components/ui";

const statusVariant = {
  ACTIVE: "success",
  FILLED: "warning",
  INACTIVE: "danger",
};

export function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ search: "", city: "", status: "" });
  const [isLoading, setIsLoading] = useState(true);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getListings({
        search: filters.search || undefined,
        city: filters.city || undefined,
        status: filters.status || undefined,
      });
      setListings(response.data.listings);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (listing, status) => {
    try {
      await adminApi.updateListingStatus(listing._id, status);
      toast.success("Listing status updated");
      loadListings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Admin" title="Manage listings" description="Review listings and update platform visibility." />
      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-[1fr_180px_180px_120px]">
          <Input label="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <Input label="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <Select label="Status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="FILLED">Filled</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
          <div className="flex items-end">
            <Button className="w-full" type="button" onClick={loadListings}>Apply</Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner label="Loading listings" /></div>
      ) : listings.length ? (
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing._id}>
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="min-w-0">
                  <h2 className="font-semibold text-[var(--color-heading)]">{listing.title}</h2>
                  <p className="mt-1 text-sm text-[var(--color-body)]">
                    {listing.location?.locality}, {listing.location?.city} / Owner: {listing.ownerId?.name || "N/A"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariant[listing.status] || "neutral"}>{listing.status}</Badge>
                  {["ACTIVE", "FILLED", "INACTIVE"].map((status) => (
                    <Button
                      key={status}
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => updateStatus(listing, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No listings found" description="Try changing your filters." />
      )}
    </>
  );
}
