import { CheckCircle2, LocateFixed, MapPin } from "lucide-react";

import { LocationSearch } from "./LocationSearch";

const hasCoordinates = (location) =>
  Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);

export function PropertyLocationPicker({ location, onChange, error }) {
  return (
    <section className="space-y-4 md:col-span-2">
      <div className="flex items-center gap-2">
        <LocateFixed className="text-[var(--color-primary)]" size={20} />
        <h2 className="font-semibold text-[var(--color-heading)]">Property location</h2>
      </div>

      <LocationSearch onSelect={onChange} />

      {hasCoordinates(location) ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={20} />
            <div>
              <p className="font-semibold text-[var(--color-heading)]">Location selected</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-body)]">
                {location.displayAddress}
              </p>
              <p className="mt-2 flex items-center gap-1 text-sm font-medium text-green-700">
                <MapPin size={15} />
                {location.locality || location.city}, {location.state || location.country}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Now fill flat number, building and landmark below.
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-[var(--color-error)]">{error}</p> : null}
    </section>
  );
}
