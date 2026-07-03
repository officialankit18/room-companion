import { LoaderCircle, MapPin, Search } from "lucide-react";
import { useState } from "react";

import { useLocationSearch } from "../../hooks/useLocationSearch";

export function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { suggestions, isSearching, error, clearSuggestions } = useLocationSearch(query);

  const selectLocation = (location) => {
    setQuery(location.displayAddress);
    setIsOpen(false);
    clearSuggestions();
    onSelect(location);
  };

  return (
    <div className="relative">
      <label htmlFor="property-location-search">
        <span className="mb-2 block text-sm font-semibold text-[var(--color-heading)]">
          Search address
        </span>
        <span className="relative block">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            size={18}
          />
          <input
            id="property-location-search"
            className="focus-ring h-12 w-full rounded-xl border border-[var(--color-border)] bg-white pl-10 pr-10 text-sm text-[var(--color-heading)] outline-none"
            placeholder="Search your property location..."
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {isSearching ? (
            <LoaderCircle
              aria-label="Searching locations"
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[var(--color-primary)]"
              size={18}
            />
          ) : null}
        </span>
      </label>

      {isOpen && suggestions.length ? (
        <div className="absolute z-[1001] mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[var(--color-border)] bg-white py-2 shadow-lg">
          {suggestions.map((location) => (
            <button
              key={`${location.latitude}-${location.longitude}`}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
              type="button"
              onClick={() => selectLocation(location)}
            >
              <MapPin className="mt-0.5 text-[var(--color-primary)]" size={17} />
              <span>
                <strong className="block text-[var(--color-heading)]">
                  {location.locality || location.city}
                </strong>
                <span className="mt-1 block leading-5 text-[var(--color-body)]">
                  {location.displayAddress}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p> : null}
      {!isSearching && isOpen && query.trim().length >= 3 && !suggestions.length && !error ? (
        <p className="mt-2 text-sm text-[var(--color-muted)]">No matching locations found.</p>
      ) : null}
    </div>
  );
}
