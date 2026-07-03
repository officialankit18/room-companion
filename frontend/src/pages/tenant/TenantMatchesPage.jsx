import { CalendarDays, HeartHandshake, Home, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { interestApi } from "../../api/interestApi";
import { listingApi } from "../../api/listingApi";
import { GoogleMapsLink } from "../../components/location/GoogleMapsLink";
import { Badge, Button, Card, EmptyState, Input, PageHeader, Select, Spinner } from "../../components/ui";

const scoreVariant = (score) => {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "neutral";
};

export function TenantMatchesPage() {
  const [filters, setFilters] = useState({ city: "", minRent: "", maxRent: "", roomType: "" });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMatches = async () => {
    setIsLoading(true);
    try {
      const response = await listingApi.getMatchedListings({
        sort: "highestCompatibility",
        city: filters.city || undefined,
        minRent: filters.minRent || undefined,
        maxRent: filters.maxRent || undefined,
        roomType: filters.roomType || undefined,
      });
      setItems(response.data.listings);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendInterest = async (listingId) => {
    try {
      await interestApi.sendInterest(listingId);
      toast.success("Interest request sent");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="AI matches"
        title="Ranked room matches"
        description="Listings are ranked by stored compatibility scores. Missing scores are generated once and reused."
      />

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-5">
          <Input label="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <Input label="Min rent" value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })} />
          <Input label="Max rent" value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })} />
          <Select label="Room type" value={filters.roomType} onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}>
            <option value="">Any</option>
            <option value="Private Room">Private Room</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Entire Flat">Entire Flat</option>
          </Select>
          <div className="flex items-end">
            <Button className="w-full" type="button" onClick={loadMatches}>
              Apply
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Loading matches" />
        </div>
      ) : items.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {items.map(({ listing, compatibility }) => (
            <Card key={listing._id}>
              <div className="flex flex-col gap-5 md:flex-row">
                <div className="h-40 rounded-xl bg-[linear-gradient(135deg,#4f46e5,#2563eb)] md:w-56" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--color-heading)]">{listing.title}</h2>
                      <p className="mt-1 flex items-center gap-2 text-sm text-[var(--color-body)]">
                        <MapPin size={16} /> {listing.location.locality}, {listing.location.city}
                      </p>
                    </div>
                    <Badge variant={scoreVariant(compatibility.score)}>{compatibility.score}% Match</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-[var(--color-body)] sm:grid-cols-2">
                    <p className="flex items-center gap-2"><Home size={16} /> {listing.roomType}</p>
                    <p className="flex items-center gap-2"><CalendarDays size={16} /> {new Date(listing.availableFrom).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--color-body)]">{compatibility.explanation}</p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-bold text-[var(--color-heading)]">Rs. {listing.rent}/mo</p>
                    <div className="flex flex-wrap gap-2">
                      <GoogleMapsLink location={listing.location} />
                      <Button type="button" onClick={() => sendInterest(listing._id)}>
                        <HeartHandshake size={18} /> Interested
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No matches yet" description="Create your tenant profile or adjust filters to see compatible rooms." />
      )}
    </>
  );
}
