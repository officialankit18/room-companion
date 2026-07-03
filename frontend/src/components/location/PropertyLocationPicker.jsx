import { LoaderCircle, LocateFixed } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { locationApi } from "../../api/locationApi";
import { LocationMap } from "./LocationMap";
import { LocationSearch } from "./LocationSearch";

const hasCoordinates = (location) =>
  Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);

export function PropertyLocationPicker({ location, onChange, error }) {
  const requestIdRef = useRef(0);
  const [isResolving, setIsResolving] = useState(false);
  const [reverseError, setReverseError] = useState("");

  const updateFromCoordinates = useCallback(
    async ({ latitude, longitude }) => {
      const requestId = ++requestIdRef.current;
      setIsResolving(true);
      setReverseError("");
      onChange({ ...location, latitude, longitude });

      try {
        const response = await locationApi.reverse(latitude, longitude);
        if (requestId === requestIdRef.current) {
          onChange(response.data.location);
        }
      } catch (requestError) {
        if (requestId === requestIdRef.current) {
          setReverseError(requestError.message);
        }
      } finally {
        if (requestId === requestIdRef.current) setIsResolving(false);
      }
    },
    [location, onChange]
  );

  return (
    <section className="space-y-4 md:col-span-2">
      <div className="flex items-center gap-2">
        <LocateFixed className="text-[var(--color-primary)]" size={20} />
        <h2 className="font-semibold text-[var(--color-heading)]">Property location</h2>
      </div>

      <LocationSearch onSelect={onChange} />

      {hasCoordinates(location) ? (
        <>
          <LocationMap
            latitude={location.latitude}
            longitude={location.longitude}
            onPositionChange={updateFromCoordinates}
          />
          <div className="rounded-xl border border-[var(--color-border)] bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-heading)]">
                  Selected address
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-body)]">
                  {location.displayAddress}
                </p>
              </div>
              {isResolving ? (
                <LoaderCircle
                  aria-label="Updating address"
                  className="animate-spin text-[var(--color-primary)]"
                  size={19}
                />
              ) : null}
            </div>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-[var(--color-muted)]">City</dt>
                <dd className="font-medium text-[var(--color-heading)]">{location.city || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">State</dt>
                <dd className="font-medium text-[var(--color-heading)]">{location.state || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Country</dt>
                <dd className="font-medium text-[var(--color-heading)]">{location.country || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">Pincode</dt>
                <dd className="font-medium text-[var(--color-heading)]">{location.pincode || "N/A"}</dd>
              </div>
            </dl>
          </div>
        </>
      ) : null}

      {error ? <p className="text-sm text-[var(--color-error)]">{error}</p> : null}
      {reverseError ? (
        <p className="text-sm text-[var(--color-error)]">{reverseError}</p>
      ) : null}
    </section>
  );
}
