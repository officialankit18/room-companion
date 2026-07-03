import { CalendarDays, Home, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { listingApi } from "../api/listingApi";
import { Badge, Button, Card, EmptyState, Input, PageHeader, Select, Spinner } from "../components/ui";

const fallbackListings = [
  {
    _id: "sample-1",
    title: "Private Room in Sector 62",
    location: { city: "Noida", locality: "Sector 62" },
    rent: 9000,
    roomType: "Private Room",
    furnishingStatus: "Fully Furnished",
    availableFrom: "2026-07-15",
    images: [],
  },
  {
    _id: "sample-2",
    title: "Shared Room near Hitech City",
    location: { city: "Hyderabad", locality: "Hitech City" },
    rent: 7500,
    roomType: "Shared Room",
    furnishingStatus: "Semi Furnished",
    availableFrom: "2026-07-20",
    images: [],
  },
];

export function BrowseListingsPage() {
  const [filters, setFilters] = useState({ city: "", minRent: "", maxRent: "", roomType: "" });
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const response = await listingApi.getListings({ limit: 6 });
        setListings(response.data.listings);
      } catch (error) {
        setListings(fallbackListings);
        toast.error("Showing sample listings until backend data is available");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const cityMatches = filters.city
      ? listing.location.city.toLowerCase().includes(filters.city.toLowerCase())
      : true;
    const minMatches = filters.minRent ? listing.rent >= Number(filters.minRent) : true;
    const maxMatches = filters.maxRent ? listing.rent <= Number(filters.maxRent) : true;
    const roomMatches = filters.roomType ? listing.roomType === filters.roomType : true;

    return cityMatches && minMatches && maxMatches && roomMatches;
  });

  return (
    <section className="page-container py-10">
      <PageHeader
        eyebrow="Browse"
        title="Find rooms that fit your plan"
        description="Explore active room listings. Tenant-specific AI ranking unlocks after login and profile setup."
      />

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label="City"
            placeholder="Noida"
            value={filters.city}
            onChange={(event) => setFilters({ ...filters, city: event.target.value })}
          />
          <Input
            label="Min rent"
            placeholder="5000"
            value={filters.minRent}
            onChange={(event) => setFilters({ ...filters, minRent: event.target.value })}
          />
          <Input
            label="Max rent"
            placeholder="15000"
            value={filters.maxRent}
            onChange={(event) => setFilters({ ...filters, maxRent: event.target.value })}
          />
          <Select
            label="Room type"
            value={filters.roomType}
            onChange={(event) => setFilters({ ...filters, roomType: event.target.value })}
          >
            <option value="">Any</option>
            <option value="Private Room">Private Room</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Entire Flat">Entire Flat</option>
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Loading listings" />
        </div>
      ) : filteredListings.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing._id} className="overflow-hidden p-0">
              <div className="h-44 bg-[linear-gradient(135deg,#4f46e5,#2563eb)]" />
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-[var(--color-heading)]">{listing.title}</h2>
                  <Badge variant="indigo">Active</Badge>
                </div>
                <div className="space-y-2 text-sm text-[var(--color-body)]">
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {listing.location.locality}, {listing.location.city}
                  </p>
                  <p className="flex items-center gap-2">
                    <Home size={16} /> {listing.roomType} · {listing.furnishingStatus}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} /> Available {new Date(listing.availableFrom).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-lg font-bold text-[var(--color-heading)]">₹{listing.rent}/mo</p>
                  <Button variant="secondary" size="sm" type="button">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No listings found"
          description="Try changing your filters or search a nearby locality."
        />
      )}
    </section>
  );
}

