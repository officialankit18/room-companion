import { LoaderCircle, LocateFixed, MapPin, Search, X } from "lucide-react";
import { useState } from "react";

import { locationApi } from "../../api/locationApi";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import { Button } from "../ui";

const popularLocations = [
  {
    displayAddress: "Connaught Place, New Delhi, Delhi, India",
    city: "Delhi",
    locality: "Connaught Place",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    latitude: 28.6315,
    longitude: 77.2167,
  },
  {
    displayAddress: "Sector 62, Noida, Uttar Pradesh, India",
    city: "Noida",
    locality: "Sector 62",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "201309",
    latitude: 28.627,
    longitude: 77.3757,
  },
  {
    displayAddress: "Cyber City, Gurugram, Haryana, India",
    city: "Gurugram",
    locality: "Cyber City",
    state: "Haryana",
    country: "India",
    pincode: "122002",
    latitude: 28.4949,
    longitude: 77.0886,
  },
  {
    displayAddress: "HITEC City, Hyderabad, Telangana, India",
    city: "Hyderabad",
    locality: "HITEC City",
    state: "Telangana",
    country: "India",
    pincode: "500081",
    latitude: 17.4435,
    longitude: 78.3772,
  },
  {
    displayAddress: "Koramangala, Bengaluru, Karnataka, India",
    city: "Bangalore",
    locality: "Koramangala",
    state: "Karnataka",
    country: "India",
    pincode: "560034",
    latitude: 12.9352,
    longitude: 77.6245,
  },
];

export function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState("");
  const { suggestions, isSearching, error, clearSuggestions } = useLocationSearch(query);

  const localSuggestions = popularLocations.filter((location) => {
    const searchText = `${location.city} ${location.locality} ${location.displayAddress}`.toLowerCase();
    return query.trim().length >= 2 && searchText.includes(query.trim().toLowerCase());
  });
  const visibleSuggestions = suggestions.length ? suggestions : localSuggestions;

  const selectLocation = (location) => {
    setQuery(location.displayAddress);
    setIsOpen(false);
    clearSuggestions();
    onSelect(location);
  };

  const detectCurrentLocation = () => {
    setDetectError("");
    if (!navigator.geolocation) {
      setDetectError("Location access is not supported in this browser.");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await locationApi.reverse(latitude, longitude);
          selectLocation(response.data.location);
        } catch (requestError) {
          setDetectError(requestError.message);
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setDetectError("Please allow location access or search manually.");
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      <Button className="w-full justify-start sm:w-auto" type="button" onClick={() => setIsOpen(true)}>
        <MapPin size={18} />
        Change Location
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-[1200] bg-black/45 px-4 py-10">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-none bg-white shadow-2xl sm:rounded-lg">
            <div className="border-b border-[var(--color-border)] bg-slate-50 p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--color-heading)]">Change Location</h3>
                <button
                  aria-label="Close location search"
                  className="rounded-full p-1 text-[var(--color-heading)] hover:bg-white"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isDetecting}
                  type="button"
                  onClick={detectCurrentLocation}
                >
                  {isDetecting ? <LoaderCircle className="animate-spin" size={18} /> : <LocateFixed size={18} />}
                  Detect my location
                </Button>
                <div className="hidden items-center text-sm text-[var(--color-muted)] sm:flex">
                  <span className="h-px w-8 bg-[var(--color-border)]" />
                  <span className="rounded-full border border-[var(--color-border)] bg-white px-2 py-1">OR</span>
                  <span className="h-px w-8 bg-[var(--color-border)]" />
                </div>
                <label className="relative flex-1" htmlFor="property-location-search">
                  <Search
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                    size={18}
                  />
                  <input
                    autoFocus
                    id="property-location-search"
                    className="focus-ring h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-10 pr-10 text-sm text-[var(--color-heading)] outline-none"
                    placeholder="Search your property location..."
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {isSearching ? (
                    <LoaderCircle
                      aria-label="Searching locations"
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[var(--color-primary)]"
                      size={18}
                    />
                  ) : null}
                </label>
              </div>
              {detectError ? <p className="mt-3 text-sm text-[var(--color-error)]">{detectError}</p> : null}
              {error ? <p className="mt-3 text-sm text-[var(--color-error)]">{error}</p> : null}
            </div>

            <div className="max-h-[55vh] overflow-y-auto bg-white py-2">
              {(query.trim().length >= 2 ? visibleSuggestions : popularLocations).map((location) => (
                <button
                  key={`${location.latitude}-${location.longitude}-${location.displayAddress}`}
                  className="flex w-full items-start gap-4 border-b border-slate-100 px-6 py-4 text-left hover:bg-slate-50"
                  type="button"
                  onClick={() => selectLocation(location)}
                >
                  <MapPin className="mt-1 shrink-0 text-[var(--color-heading)]" size={18} />
                  <span>
                    <strong className="block text-base text-[var(--color-heading)]">
                      {location.locality || location.city}
                    </strong>
                    <span className="mt-1 block leading-5 text-[var(--color-body)]">
                      {location.displayAddress}
                    </span>
                  </span>
                </button>
              ))}
              {!isSearching && query.trim().length >= 3 && !visibleSuggestions.length && !error ? (
                <p className="px-6 py-5 text-sm text-[var(--color-muted)]">No matching locations found.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
